import cookie from 'js-cookie'
import type { IncomingMessage } from 'http'

/**
 * Cookie Handler
 */
const Cookie = {
    /**
     * Set cookie
     */
    set(value: string, key: string, options?: cookie.CookieAttributes) {
        if (typeof window !== 'undefined' && value)
            cookie.set(key, value, {
                expires: 1,
                path: '/',
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'lax',
                ...options,
            })
    },
    /**
     * Remove cookie
     */
    remove(key: string, options?: cookie.CookieAttributes) {
        if (typeof window !== 'undefined')
            cookie.remove(key, {
                expires: 1,
                ...options,
            })
    },
    /**
     * Get cookie
     */
    get(req: IncomingMessage | null, key: string) {
        return typeof window !== 'undefined'
            ? cookie.get(key) ?? null
            : req?.headers?.cookie
                ?.split(';')
                ?.find(c => c?.trim()?.startsWith(`${key}=`))
                ?.split('=')?.[1] ?? null
    },
}

export default Cookie
