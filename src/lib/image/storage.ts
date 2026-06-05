import { createReadStream } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { z } from 'zod'

import { isValidImageIdentity } from 'lib/image/identity'
import type { ClosetImageIdentity } from 'lib/image/identity'
import type { NextRequest } from 'next/server'

const PROD_IMAGE_BASE = 'https://in-flames-closet.kiriancaumes.fr/image'
const SAFE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'] as const

/** Schema for uploaded closet images. */
export const uploadSchema = z.object({
    folderId: z.string().min(1).regex(SAFE_ID_PATTERN, 'folderId must be alphanumeric'),
    image: z
        .instanceof(File)
        .refine(file => file.size > 0, 'Image must not be empty')
        .refine(
            file => (ALLOWED_MIME_TYPES as ReadonlyArray<string>).includes(file.type),
            `Image must be one of: ${ALLOWED_MIME_TYPES.join(', ')}`,
        )
        .refine(file => SAFE_ID_PATTERN.test(file.name), 'Image filename must contain only safe characters'),
})

/**
 * Serves a closet image from production in development or local storage in production.
 * @param req Incoming request for conditional cache headers.
 * @param identity Requested closet image identity.
 * @returns Image response.
 */
export async function serveClosetImage(req: NextRequest, identity: ClosetImageIdentity): Promise<Response> {
    if (!isValidImageIdentity(identity)) {
        return new Response('Invalid path', { status: 400 })
    }

    if (process.env.NODE_ENV === 'development') {
        return proxyProductionImage(identity)
    }

    try {
        const filePath = join(process.cwd(), 'upload', identity.folderId, identity.imageId)
        const stats = await stat(filePath)
        const etag = `W/"${stats.mtime.getTime().toString(16)}-${stats.size.toString(16)}"`
        const lastModified = stats.mtime.toUTCString()

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
                ETag: etag,
                'Last-Modified': lastModified,
                'Cache-Control': 'public, max-age=2678400, stale-while-revalidate=86400',
            },
        })
    } catch {
        return new Response('Not found', { status: 404 })
    }
}

/**
 * Stores an uploaded closet image in local storage.
 * @param folderId Target folder ID.
 * @param image Uploaded image file.
 * @returns Promise that resolves after writing the file.
 */
export async function storeUploadedImage(folderId: string, image: File): Promise<void> {
    const buffer = Buffer.from(await image.arrayBuffer())
    const dir = join(process.cwd(), 'upload', folderId)
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, image.name), buffer)
}

/**
 * Proxies a production closet image during local development.
 * @param identity Requested closet image identity.
 * @returns Image response copied from production.
 */
async function proxyProductionImage(identity: ClosetImageIdentity): Promise<Response> {
    const url = `${PROD_IMAGE_BASE}/${encodeURIComponent(identity.folderId)}/${encodeURIComponent(identity.imageId)}`
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
}
