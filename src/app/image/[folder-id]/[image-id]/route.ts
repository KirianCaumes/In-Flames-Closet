import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { join } from 'node:path'
import type { NextRequest } from 'next/server'

const PROD_IMAGE_BASE = 'https://in-flames-closet.kiriancaumes.fr/image'

/**
 * Serve a file from the local upload directory.
 * In development, proxies from the production site instead.
 * URL pattern: /image/[folder-id]/[image-id]
 * @param req The incoming request
 * @returns The image file or an error response
 */
export async function GET(
    req: NextRequest,
    {
        params,
    }: {
        /** The route parameters */
        readonly params: Promise<{
            /** The folder ID */
            readonly 'folder-id': string
            /** The image ID */
            readonly 'image-id': string
        }>
    },
) {
    const resolved = await params
    const folderId = resolved['folder-id']
    const imageId = resolved['image-id']

    if (!/^[a-zA-Z0-9_-]+$/.test(folderId) || !/^[a-zA-Z0-9_-]+$/.test(imageId)) {
        return new Response('Invalid path', { status: 400 })
    }

    // In development, proxy from the production site
    if (process.env.NODE_ENV === 'development') {
        const url = `${PROD_IMAGE_BASE}/${encodeURIComponent(folderId)}/${encodeURIComponent(imageId)}`
        const response = await fetch(url)
        if (!response.ok) {
            return new Response('Not found', { status: 404 })
        }
        const contentType = response.headers.get('content-type') ?? 'image'
        return new Response(response.body, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=2678400, stale-while-revalidate=86400',
            },
        })
    } else {
        try {
            const filePath = join(process.cwd(), 'upload', folderId, imageId)
            const stats = await stat(filePath)

            // Build a weak ETag from mtime + size (same strategy as express.static)
            const etag = `W/"${stats.mtime.getTime().toString(16)}-${stats.size.toString(16)}"`
            const lastModified = stats.mtime.toUTCString()

            // Conditional GET support
            if (req.headers.get('if-none-match') === etag) {
                return new Response(null, { status: 304 })
            }

            const nodeStream = createReadStream(filePath)
            const readableStream = new ReadableStream<Uint8Array>({
                start(controller) {
                    nodeStream.on('data', (chunk: Buffer | string) => {
                        controller.enqueue(new Uint8Array(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
                    })
                    nodeStream.on('end', () => {
                        controller.close()
                    })
                    nodeStream.on('error', err => {
                        controller.error(err)
                    })
                },
                cancel() {
                    nodeStream.destroy()
                },
            })

            return new Response(readableStream, {
                headers: {
                    'Content-Type': 'image',
                    'ETag': etag,
                    'Last-Modified': lastModified,
                    // Not useful when the image is served from the Next.js image optimization API "<Image />" component, but still good for direct access
                    'Cache-Control': 'public, max-age=2678400, stale-while-revalidate=86400',
                },
            })
        } catch {
            return new Response('Not found', { status: 404 })
        }
    }
}
