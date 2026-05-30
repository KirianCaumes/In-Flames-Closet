import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import type { NextRequest } from 'next/server'

const PROD_IMAGE_BASE = 'https://in-flames-closet.kiriancaumes.fr/image'

/**
 * Serve a file from the local upload directory.
 * In development, proxies from the production site instead.
 * URL pattern: /image/[folder-id]/[image-id]
 * @param _req The incoming request (not used)
 * @returns The image file or an error response
 */
export async function GET(
    _req: NextRequest,
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
        const upstream = await fetch(url)
        if (!upstream.ok) {
            return new Response('Not found', { status: 404 })
        }
        const contentType = upstream.headers.get('content-type') ?? 'image'
        const body = await upstream.arrayBuffer()
        return new Response(body, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=2678400, stale-while-revalidate=86400',
            },
        })
    } else {
        try {
            const filePath = join(process.cwd(), 'upload', folderId, imageId)
            await stat(filePath)

            // Determine MIME type from extension
            const ext = imageId.split('.').pop()?.toLowerCase() ?? ''
            const mimeMap: Record<string, string> = {
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                gif: 'image/gif',
                webp: 'image/webp',
                avif: 'image/avif',
            }
            const contentType = mimeMap[ext] ?? 'image'

            return new Response(Readable.toWeb(createReadStream(filePath)) as ReadableStream, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=2678400, stale-while-revalidate=86400',
                },
            })
        } catch {
            return new Response('Not found', { status: 404 })
        }
    }
}
