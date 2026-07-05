import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    poweredByHeader: false,
    // Keep google-auth-library external: it relies on Node built-ins (node:net via node-fetch) and must not be bundled.
    serverExternalPackages: ['google-auth-library'],
    images: {
        minimumCacheTTL: 2678400, // 31 days
        maximumDiskCacheSize: 2147483648, // Limits the .next/cache/images folder to exactly 2 GB
        contentDispositionType: 'inline',
    },
    experimental: {
        preloadEntriesOnStart: false,
        webpackMemoryOptimizations: true,
    },
}

export default nextConfig
