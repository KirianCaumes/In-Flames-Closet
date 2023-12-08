/** @type {import('knip').KnipConfig} */
const config = {
    ignore: [
        'next-sitemap.config.js',
        // Not used atm
        'src/components/gdpr-banner.tsx',
        'src/helpers/cookie.ts',
    ],
    ignoreDependencies: [
        'eslint-config-next',
        'postcss-scss',
        'sharp',
        // Not used atm
        'js-cookie',
        '@types/js-cookie',
        '@types/react-gtm-module',
        'react-ga4',
        'eslint-import-resolver-typescript',
    ],
    ignoreExportsUsedInFile: {
        interface: true,
        type: true,
        member: true,
    },
}

export default config
