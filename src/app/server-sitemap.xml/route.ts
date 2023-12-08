import { getServerSideSitemap } from 'next-sitemap'
import database from 'helpers/database'
import type { ISitemapField } from 'next-sitemap'

/**
 * GET
 * @param request request
 */
// eslint-disable-next-line import/prefer-default-export
export async function GET() {
    const { items } = await database.getAll({
        offset: 9999,
        page: 1,
        links: [],
        years: [],
        categories: [],
        sort: 'new',
        title: '',
    })

    const fields: Array<ISitemapField> = items.map(item => ({
        loc: `${process.env.SITE_URL}/${item.folderId}`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
    }))

    return getServerSideSitemap(fields)
}
