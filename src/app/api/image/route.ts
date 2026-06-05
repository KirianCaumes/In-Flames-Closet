import { storeUploadedImage, uploadSchema } from 'lib/image/storage'
import type { NextRequest } from 'next/server'

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

    await storeUploadedImage(folderId, image)

    return new Response('', { status: 200 })
}
