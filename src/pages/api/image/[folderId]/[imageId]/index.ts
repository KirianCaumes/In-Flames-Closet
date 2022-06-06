import express from 'express'

export const config = {
    api: { externalResolver: true },
}
const handler = express()

const serveFiles = express.static('./upload')
handler.use(['/api/image', '/image'], serveFiles)

export default handler
