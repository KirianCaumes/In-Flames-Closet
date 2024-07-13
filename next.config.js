/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        // domains: ['drive.google.com'],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 Days
    },
    publicRuntimeConfig: {
        googleAnalyticsId: 'G-3Y038V6XRB',
        adminEmail: 'kirian.caumes@gmail.com',
    },
    poweredByHeader: false,
}

module.exports = nextConfig
