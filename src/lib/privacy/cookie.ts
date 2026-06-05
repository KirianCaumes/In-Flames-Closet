/**
 * Lightweight cookie utility using the native browser API.
 * All methods are SSR-safe and no-op on the server.
 */
const Cookie = {
    /**
     * Read a cookie by key. Returns null when not found or during SSR.
     * @param key - The name of the cookie to retrieve
     * @returns The cookie value, or null if not found or during SSR
     */
    get(key: string): string | null {
        if (typeof window === 'undefined') {
            return null
        }
        const match = new RegExp(`(?:^|; )${encodeURIComponent(key)}=([^;]*)`).exec(document.cookie)
        return match ? decodeURIComponent(match[1]) : null
    },

    /**
     * Set a cookie. Defaults to 365 days expiry, Lax same-site, Secure in production.
     * @param key - The name of the cookie to set
     * @param value - The value of the cookie
     * @param days - The number of days until the cookie expires
     */
    set(key: string, value: string, days = 365): void {
        if (typeof window === 'undefined') {
            return
        }
        const expires = new Date(Date.now() + days * 864e5).toUTCString()
        const secure = process.env.NODE_ENV !== 'development' ? '; Secure' : ''
        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`
    },

    /**
     * Delete a cookie by setting its expiry in the past.
     * @param key - The name of the cookie to delete
     */
    remove(key: string): void {
        if (typeof window === 'undefined') {
            return
        }
        document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    },
}

export default Cookie
