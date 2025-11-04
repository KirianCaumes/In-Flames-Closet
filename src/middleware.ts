import { NextResponse, type NextRequest } from 'next/server'

/**
 * middleware
 * @param req request
 */
// eslint-disable-next-line import/prefer-default-export
export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/image')) {
        const url = req.nextUrl.clone()

        if (process.env.NODE_ENV === 'development') {
            url.href = `https://in-flames-closet.kiriancaumes.fr/${req.nextUrl.pathname}`
            return NextResponse.redirect(url)
        }

        url.pathname = `/api${req.nextUrl.pathname}`
        // Rewrite /image/... to /api/image/...
        return NextResponse.rewrite(url)
    }

    return null
}

export const config = {
    matcher: '/image/:path*',
}
