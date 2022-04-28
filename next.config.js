/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['drive.google.com'],
        minimumCacheTTL: 60 * 60 * 24,
    },
}

module.exports = nextConfig
