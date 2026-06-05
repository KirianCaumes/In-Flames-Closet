import { fetchClosetItems } from 'lib/catalog/data'
import { buildItemDetailUrl } from 'lib/projection/item'
import type { MetadataRoute } from 'next'

/**
 * Generate the XML sitemap for the application.
 * Lists the home page and every item detail page.
 * @returns Array of sitemap entries consumed by Next.js to build /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = process.env.SITE_URL ?? ''

    const items = await fetchClosetItems()

    return [
        {
            url: base,
            changeFrequency: 'daily',
            priority: 1,
        },
        ...items.map(item => ({
            url: buildItemDetailUrl(base, item),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
    ]
}
