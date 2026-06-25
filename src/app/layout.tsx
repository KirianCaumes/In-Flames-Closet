// eslint-disable-next-line camelcase
import { Oswald, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import GdprBanner from 'components/layout/gdpr-banner'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
// eslint-disable-next-line no-restricted-imports
import './globals.css'

const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-plex-sans', display: 'swap' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-mono', display: 'swap' })
const oswald = Oswald({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-oswald', display: 'swap' })

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
    title: {
        default: "In Flames Closet - Archive of the band's artworks",
        template: '%s - In Flames Closet',
    },
    metadataBase: new URL(process.env.SITE_URL ?? 'https://in-flames-closet.kiriancaumes.fr'),
    description:
        // eslint-disable-next-line max-len
        'An archive of In Flames artworks throughout the years: clothes, goodies, and more! Explore the history of the band through their merchandise and official products.',
    keywords: ['In Flames', 'closet', 'merchandise', 'clothes', 'goodies', 'artwork', 'band', 'metal'],
    authors: [{ name: "A Jester's Collection", url: 'https://jesterscollection.kiriancaumes.fr' }],
    creator: "A Jester's Collection",
    alternates: { canonical: '/' },
    robots: { index: false, follow: false },
    openGraph: {
        type: 'website',
        siteName: 'In Flames Closet',
        locale: 'en_US',
        title: "In Flames Closet - Archive of the band's artworks",
        description:
            // eslint-disable-next-line max-len
            'An archive of In Flames artworks throughout the years: clothes, goodies, and more! Explore the history of the band through their merchandise and official products.',
        images: [{ url: '/favicon.png', width: 313, height: 313, alt: 'In Flames' }],
    },
    twitter: {
        card: 'summary',
        title: "In Flames Closet - Archive of the band's artworks",
        description:
            // eslint-disable-next-line max-len
            'An archive of In Flames artworks throughout the years: clothes, goodies, and more! Explore the history of the band through their merchandise and official products.',
        images: ['/favicon.png'], // TODO faire les png
    },
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
    },
}

/**
 * Root layout - wraps all pages with global styles, font and the GDPR banner
 * @returns The root layout component
 */
export default function RootLayout({
    children,
}: {
    /** The child components to be rendered within the layout */ readonly children: ReactNode
}) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <body
                className={`${plexSans.variable} ${plexMono.variable} ${oswald.variable} font-sans bg-gray-950 text-gray-100 min-h-screen`}
            >
                {/* Thumbnails fade in via an onLoad handler; with JS disabled that never fires, so reveal them here. */}
                <noscript>
                    <style>{`.thumb-image{opacity:1 !important}`}</style>
                </noscript>
                {children}

                {/* ── Footer ─────────────────────────────────────────────── */}
                <footer className="border-t border-gray-800/50 mt-12 py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-4">
                        <p className="text-gray-500 text-xs text-center">
                            Non-commercial fan archive. All recordings and trademarks belong to their respective owners.
                        </p>
                        <a
                            className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                            href="https://jesterscollection.kiriancaumes.fr"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            jesterscollection.kiriancaumes.fr
                        </a>
                    </div>
                </footer>
                <GdprBanner />
            </body>
        </html>
    )
}
