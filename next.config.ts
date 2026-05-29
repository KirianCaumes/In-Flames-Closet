import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    poweredByHeader: false,
    experimental: {
        preloadEntriesOnStart: false,
        webpackMemoryOptimizations: true,
    },
}

export default nextConfig
