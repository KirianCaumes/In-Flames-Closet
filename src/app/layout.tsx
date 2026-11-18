// eslint-disable-next-line camelcase
import { Besley, Schibsted_Grotesk } from 'next/font/google'
import GdprBanner from 'components/layout/gdpr-banner'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
// eslint-disable-next-line no-restricted-imports
import './globals.css'

const schibsted = Schibsted_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-schibsted', display: 'swap' })
const besley = Besley({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-besley', display: 'swap' })

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
        images: [{ url: '/favicon.png', width: 512, height: 512, alt: 'In Flames Closet' }],
    },
    twitter: {
        card: 'summary',
        title: "In Flames Closet - Archive of the band's artworks",
        description:
            // eslint-disable-next-line max-len
            'An archive of In Flames artworks throughout the years: clothes, goodies, and more! Explore the history of the band through their merchandise and official products.',
        images: ['/favicon.png'],
    },
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
    },
}

export const viewport: Viewport = {
    themeColor: '#0a0a0a',
    width: 'device-width',
    initialScale: 1,
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
            <body className={`${schibsted.variable} ${besley.variable} font-sans bg-gray-950 text-gray-100 min-h-screen`}>
                {/* Thumbnails fade in via an onLoad handler; with JS disabled that never fires, so reveal them here. */}
                <noscript>
                    <style>{`.thumb-image{opacity:1 !important}`}</style>
                </noscript>
                {children}

                <footer className="border-t border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 text-[13px] text-gray-400">
                        <p>Non-commercial fan archive. All artworks and trademarks belong to their respective owners.</p>
                        <nav
                            aria-label="Related sites"
                            className="flex flex-wrap gap-x-5 gap-y-1"
                        >
                            <a
                                className="inline-flex items-center min-h-11 text-gray-100 hover:text-white transition-colors"
                                href="https://in-flames-bootlegs.kiriancaumes.fr"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                In Flames Bootlegs
                            </a>
                            <a
                                className="inline-flex items-center min-h-11 text-gray-100 hover:text-white transition-colors"
                                href="https://jesterscollection.kiriancaumes.fr"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                A Jester&apos;s Collection
                            </a>
                        </nav>
                    </div>
                </footer>
                <GdprBanner />
            </body>
        </html>
    )
}
