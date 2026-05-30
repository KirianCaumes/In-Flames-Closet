import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    poweredByHeader: false,
    images: {
        minimumCacheTTL: 2678400, // 31 days
    },
    experimental: {
        preloadEntriesOnStart: false,
        webpackMemoryOptimizations: true,
    },
}

export default nextConfig
