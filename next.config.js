/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['drive.google.com'],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 Days
    },
}

module.exports = nextConfig
