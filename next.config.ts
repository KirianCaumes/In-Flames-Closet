import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        minimumCacheTTL: 60 * 60 * 24 * 30,
    },
    poweredByHeader: false,
}

export default nextConfig
