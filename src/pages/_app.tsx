import React from 'react'
import type { AppProps } from 'next/app'
import 'styles/index.scss'
import Layout from 'components/layout'
import GdprBanner from 'components/gdprBanner'

/**
 * My app
 */
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <GdprBanner />
            <Layout>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Component {...pageProps} />
            </Layout>
        </>
    )
}

export default MyApp
