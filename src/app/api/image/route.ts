import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { z } from 'zod'
import type { NextRequest } from 'next/server'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'] as const

const uploadSchema = z.object({
    folderId: z
        .string()
        .min(1)
        .regex(/^[a-zA-Z0-9_-]+$/, 'folderId must be alphanumeric'),
    image: z
        .instanceof(File)
        .refine(f => f.size > 0, 'Image must not be empty')
        .refine(
            f => (ALLOWED_MIME_TYPES as ReadonlyArray<string>).includes(f.type),
            `Image must be one of: ${ALLOWED_MIME_TYPES.join(', ')}`,
        )
        .refine(
            f => /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(f.name),
            'Image filename must contain only safe characters',
        ),
})

/**
 * Upload an image to the local upload directory.
 * Requires the x-api-key header to match the API_KEY environment variable.
 * Expects multipart/form-data with fields: folderId (string) and image (File).
 * @param req The incoming request containing the image and folder ID
 * @returns A success response or an error response if the request is invalid
 */
export async function POST(req: NextRequest) {
    if (req.headers.get('x-api-key') !== process.env.API_KEY) {
        return new Response('Invalid API Key', { status: 401 })
    }

    let formData: FormData
    try {
        formData = await req.formData()
    } catch {
        return new Response('Invalid form data', { status: 400 })
    }

    const result = uploadSchema.safeParse({
        folderId: formData.get('folderId'),
        image: formData.get('image'),
    })

    if (!result.success) {
        return new Response(result.error.issues.map(i => i.message).join(', '), { status: 400 })
    }

    const { folderId, image } = result.data

    const buffer = Buffer.from(await image.arrayBuffer())
    const dir = join(process.cwd(), 'upload', folderId)
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, image.name), buffer)

    return new Response('', { status: 200 })
}
