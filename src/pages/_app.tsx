import React from 'react'
import type { AppProps } from 'next/app'
import 'styles/index.scss'
import Layout from 'components/layout'

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
