import React from 'react'
import Layout from 'components/layout'
import type { AppProps } from 'next/app'
import 'styles/index.scss'

/**
 * My app
 */
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            {/* GDPR is disable for now */}
            {/* <GdprBanner /> */}
            <Layout>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Component {...pageProps} />
            </Layout>
        </>
    )
}

export default MyApp
