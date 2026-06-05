import Cookie from 'lib/privacy/cookie'

/** Consent state for analytics cookies. */
export type AnalyticsConsent = boolean | null

/** Consent cookie key. */
export const CONSENT_COOKIE = 'accept_cookies'

const GA_COOKIE_KEYS = ['_ga', '_gat', '_gid'] as const
const consentListeners = new Set<() => void>()

/**
 * Read analytics consent from cookies.
 * @returns Stored consent, or null when missing.
 */
export function getAnalyticsConsent(): AnalyticsConsent {
    const value = Cookie.get(CONSENT_COOKIE)
    if (value === null) {
        return null
    }

    return value === 'true'
}

/**
 * Server snapshot for analytics consent.
 * @returns Accepted state during SSR to keep the banner hidden until hydrated.
 */
export function getAnalyticsConsentServerSnapshot(): AnalyticsConsent {
    return true
}

/**
 * Subscribe to analytics consent changes.
 * @param callback - Listener to notify.
 * @returns Unsubscribe function.
 */
export function subscribeToAnalyticsConsent(callback: () => void): () => void {
    consentListeners.add(callback)
    return () => {
        consentListeners.delete(callback)
    }
}

/**
 * Accept analytics cookies.
 */
export function acceptAnalyticsConsent(): void {
    Cookie.set(CONSENT_COOKIE, 'true', 99999)
    notifyAnalyticsConsentChange()
}

/**
 * Refuse analytics cookies and remove known Google Analytics cookies.
 */
export function refuseAnalyticsConsent(): void {
    Cookie.set(CONSENT_COOKIE, 'false', 99999)
    GA_COOKIE_KEYS.forEach(key => {
        Cookie.remove(key)
    })
    notifyAnalyticsConsentChange()
}

/** Notify all analytics consent listeners. */
function notifyAnalyticsConsentChange(): void {
    consentListeners.forEach(callback => {
        callback()
    })
}
