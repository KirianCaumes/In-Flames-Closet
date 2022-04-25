import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    const { imgId } = req.query

    const { data } = await axios.request({
        method: 'GET',
        url: `https://www.googleapis.com/drive/v3/files/${imgId}`,
        params: {
            key: process.env.GOOGLE_API_KEY,
            alt: 'media',
        },
        responseType: 'arraybuffer',
    })

    res.status(200).send(data)
}
