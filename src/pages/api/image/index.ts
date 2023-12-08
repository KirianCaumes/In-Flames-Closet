import { mkdir, readFile, writeFile } from 'fs/promises'
import { IncomingForm } from 'formidable'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST': {
            if (req.headers['x-api-key'] !== process.env.API_KEY) {
                return res.status(401).send('Invalid API Key')
            }

            const form = new IncomingForm({ multiples: true })

            const [fields, files] = await form.parse(req)

            const folderId = fields.folderId?.[0]
            const file = files.image?.[0]

            if (!file) {
                return res.status(400).send('No image provided')
            }

            if (!folderId) {
                return res.status(400).send('No folderId provided')
            }

            const data = await readFile(file.filepath)
            await mkdir(`upload/${folderId}`, { recursive: true })
            await writeFile(`upload/${folderId}/${file.originalFilename}`, data)
            return res.status(200).send('')
        }
        default:
            return res.status(405).send('Method not allowed')
    }
}
