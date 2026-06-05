import { serveClosetImage } from 'lib/image/storage'
import type { NextRequest } from 'next/server'

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
    return serveClosetImage(req, { folderId: resolved['folder-id'], imageId: resolved['image-id'] })
}
