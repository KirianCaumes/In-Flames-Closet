import database from 'lib/database'
import type { MetadataRoute } from 'next'

/**
 * Generate the XML sitemap for the application.
 * Lists the home page and every item detail page.
 * @returns Array of sitemap entries consumed by Next.js to build /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = process.env.SITE_URL ?? ''

    const items = await database.getItems()

    return [
        {
            url: base,
            changeFrequency: 'daily',
            priority: 1,
        },
        ...items.map(item => ({
            url: `${base}/${item.folderId}`,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
    ]
}
