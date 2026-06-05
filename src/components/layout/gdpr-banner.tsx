'use client'

import Script from 'next/script'
import { useSyncExternalStore } from 'react'
import {
    acceptAnalyticsConsent,
    getAnalyticsConsent,
    getAnalyticsConsentServerSnapshot,
    refuseAnalyticsConsent,
    subscribeToAnalyticsConsent,
} from 'lib/privacy/consent'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

/**
 * Component that displays a GDPR consent banner for cookie usage, specifically for Google Analytics.
 * @returns JSX element representing the GDPR consent banner and conditional GA scripts
 */
export default function GdprBanner() {
    const hasConsent = useSyncExternalStore(subscribeToAnalyticsConsent, getAnalyticsConsent, getAnalyticsConsentServerSnapshot)
    const isVisible = hasConsent === null
    const isGaEnabled = hasConsent === true

    return (
        <>
            {typeof window !== 'undefined' && isGaEnabled && GA_ID && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${GA_ID}', { cookie_flags: 'SameSite=None;Secure' });
                            `,
                        }}
                        id="google-analytics"
                        strategy="afterInteractive"
                    />
                </>
            )}

            {isVisible && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-stone-900/80 backdrop-blur-sm border-t border-stone-800 shadow-2xl">
                    <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center gap-4">
                        <p className="text-sm text-stone-400 flex-1 text-center sm:text-left">
                            This site uses cookies to analyze your preferences anonymously via Google Analytics. You can accept this to
                            allow us to improve your experience, or refuse it.
                        </p>

                        <div className="flex gap-2 shrink-0">
                            <button
                                // eslint-disable-next-line max-len
                                className="flex items-center gap-2 px-4 py-2 rounded bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors cursor-pointer"
                                onClick={acceptAnalyticsConsent}
                                type="button"
                            >
                                <CookieIcon />
                                Accept
                            </button>
                            <button
                                // eslint-disable-next-line max-len
                                className="flex items-center gap-2 px-4 py-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium transition-colors cursor-pointer"
                                onClick={refuseAnalyticsConsent}
                                type="button"
                            >
                                <CloseIcon />
                                Refuse
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

/**
 * Icon component representing a cookie, used in the accept button of the GDPR banner.
 * @returns JSX element representing a cookie icon
 */
function CookieIcon() {
    return (
        <svg
            className="w-4 h-4 fill-current"
            version="1.1"
            viewBox="0 0 120.23 122.88"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                <path
                    // eslint-disable-next-line max-len
                    d="M98.18,0c3.3,0,5.98,2.68,5.98,5.98c0,3.3-2.68,5.98-5.98,5.98c-3.3,0-5.98-2.68-5.98-5.98 C92.21,2.68,94.88,0,98.18,0L98.18,0z M99.78,52.08c5.16,7.7,11.69,10.06,20.17,4.85c0.28,2.9,0.35,5.86,0.2,8.86 c-1.67,33.16-29.9,58.69-63.06,57.02C23.94,121.13-1.59,92.9,0.08,59.75C1.74,26.59,30.95,0.78,64.1,2.45 c-2.94,9.2-0.45,17.37,7.03,20.15C64.35,44.38,79.49,58.63,99.78,52.08L99.78,52.08z M30.03,47.79c4.97,0,8.99,4.03,8.99,8.99 s-4.03,8.99-8.99,8.99c-4.97,0-8.99-4.03-8.99-8.99S25.07,47.79,30.03,47.79L30.03,47.79z M58.35,59.25c2.86,0,5.18,2.32,5.18,5.18 c0,2.86-2.32,5.18-5.18,5.18c-2.86,0-5.18-2.32-5.18-5.18C53.16,61.57,55.48,59.25,58.35,59.25L58.35,59.25z M35.87,80.59 c3.49,0,6.32,2.83,6.32,6.32c0,3.49-2.83,6.32-6.32,6.32c-3.49,0-6.32-2.83-6.32-6.32C29.55,83.41,32.38,80.59,35.87,80.59 L35.87,80.59z M49.49,32.23c2.74,0,4.95,2.22,4.95,4.95c0,2.74-2.22,4.95-4.95,4.95c-2.74,0-4.95-2.22-4.95-4.95 C44.54,34.45,46.76,32.23,49.49,32.23L49.49,32.23z M76.39,82.8c4.59,0,8.3,3.72,8.3,8.3c0,4.59-3.72,8.3-8.3,8.3 c-4.59,0-8.3-3.72-8.3-8.3C68.09,86.52,71.81,82.8,76.39,82.8L76.39,82.8z M93.87,23.1c3.08,0,5.58,2.5,5.58,5.58 c0,3.08-2.5,5.58-5.58,5.58s-5.58-2.5-5.58-5.58C88.29,25.6,90.79,23.1,93.87,23.1L93.87,23.1z"
                    style={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
                />
            </g>
        </svg>
    )
}

/**
 * Icon component representing a close (X) symbol, used in the refuse button of the GDPR banner.
 * @returns JSX element representing a close icon
 */
function CloseIcon() {
    return (
        <svg
            aria-hidden="true"
            className="w-4 h-4 fill-current"
            viewBox="0 0 384 512"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* eslint-disable-next-line max-len */}
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
    )
}
