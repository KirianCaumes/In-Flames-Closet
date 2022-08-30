import React from 'react'
import Document, {
    Head, Html, Main, NextScript,
} from 'next/document'

/**
 * My document
 */
class MyDocument extends Document {
    // eslint-disable-next-line class-methods-use-this
    /**
     * Render
     */
    render() {
        return (
            <Html>
                <Head>
                    <meta
                        name="description"
                        content="The history of In Flames through their artworks: clothes, goodies, and more!"
                    />
                    <meta
                        name="keywords"
                        content="in flames, jesterhead, in flames collection, ajesterscollection, jesterscollection, artworks"
                    />
                    <meta
                        name="author"
                        content="Kirian CAUMES"
                    />

                    <meta
                        property="og:type"
                        content="website"
                    />
                    <meta
                        property="og:title"
                        content="The history of In Flames through their artworks: clothes, goodies, and more!"
                    />
                    <meta
                        property="og:description"
                        content="The history of In Flames through their artworks: clothes, goodies, and more!"
                    />
                    <meta
                        property="og:image"
                        content={`${process.env.SITE_URL}/images/background.png`}
                    />
                    <meta
                        property="og:url"
                        content={`${process.env.SITE_URL}`}
                    />

                    <meta
                        property="twitter:title"
                        content="The history of In Flames through their artworks: clothes, goodies, and more!"
                    />
                    <meta
                        property="twitter:description"
                        content="The history of In Flames through their artworks: clothes, goodies, and more!"
                    />
                    <meta
                        property="twitter:card"
                        content="summary_large_image"
                    />
                    <meta
                        property="twitter:image"
                        content={`${process.env.SITE_URL}/images/background.png`}
                    />
                    <meta
                        property="twitter:url"
                        content={`${process.env.SITE_URL}`}
                    />

                    <link
                        rel="icon"
                        href="/favicon.svg"
                        type="image/svg+xml"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="48x48"
                        href="/favicons/favicon-48x48.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="192x192"
                        href="/favicons/android-chrome-192x192.png"
                    />
                    <link
                        rel="manifest"
                        href="/site.webmanifest"
                    />
                    <meta
                        name="msapplication-TileColor"
                        content="#363636"
                    />
                    <meta
                        name="theme-color"
                        content="#363636"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
