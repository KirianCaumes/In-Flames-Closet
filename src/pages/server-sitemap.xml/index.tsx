import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import getDatabase, { ESort } from 'helpers/database'

export const getServerSideProps: GetServerSideProps = async ctx => {
    const database = getDatabase()

    const { items } = await database.getAll({
        offset: 9999,
        page: 1,
        links: [],
        years: [],
        categories: [],
        sort: ESort.NEW,
        title: '',
    })

    const fields: ISitemapField[] = items.map(item => ({
        loc: `${process.env.SITE_URL}/${item.folderId}`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
    }))

    return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default function Sitemap() { }
