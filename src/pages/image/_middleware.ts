import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Middleware
 * @param req Request
 */
// eslint-disable-next-line import/prefer-default-export
export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    url.pathname = `/api${req.nextUrl.pathname}`
    // Rewrite /images/... to /api/images/...
    return NextResponse.rewrite(url)
}
