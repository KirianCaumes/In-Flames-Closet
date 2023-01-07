import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Middleware
 * @param req Request
 */
// eslint-disable-next-line import/prefer-default-export
export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()

    if (process.env.NODE_ENV === 'development') {
        url.href = `https://in-flames-closet.kiriancaumes.fr/${req.nextUrl.pathname}`
        return NextResponse.redirect(url)
    }

    url.pathname = `/api${req.nextUrl.pathname}`
    // Rewrite /image/... to /api/image/...
    return NextResponse.rewrite(url)
}
