import type { MetadataRoute } from 'next'

const SITE_URL = process.env.SITE_URL ?? 'https://in-flames-closet.kiriancaumes.fr'

/**
 * Generate the /robots.txt response.
 * The closet archive is intentionally not indexed (robots noindex in the metadata), so disallow every crawler.
 * @returns Robots metadata consumed by Next.js to render /robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [{ userAgent: '*', allow: '/' }],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}
