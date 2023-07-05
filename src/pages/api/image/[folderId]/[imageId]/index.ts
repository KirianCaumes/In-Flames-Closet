import express from 'express'

export const config = {
    api: { externalResolver: true },
}
const handler = express()

const serveFiles = express.static('./upload', {
    setHeaders: res => {
        // To force preview in navigator
        res.setHeader('Content-Type', 'image')
    },
})
handler.use(['/api/image', '/image'], serveFiles)

export default handler
