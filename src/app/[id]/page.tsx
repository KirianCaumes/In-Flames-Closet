import { notFound } from 'next/navigation'
import database from 'lib/database'
import ItemDetail from 'components/item-detail'
import type { Metadata } from 'next'

/**
 * Generate per-item Open Graph metadata
 * @returns Metadata for the item detail page, including title, description, and Open Graph/Twitter card info
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({
    params,
}: {
    /** Parameters for the item detail page */
    readonly params: Promise<{
        /** The ID of the item */
        readonly id: string
    }>
}): Promise<Metadata> {
    const { id } = await params
    const item = await database.getById(id)
    if (!item) {
        return { title: 'Item not found' }
    }

    const description = [item.title, item.category, item.year].filter(Boolean).join(' - ')
    const imageUrl = `${process.env.SITE_URL ?? ''}/image/${item.folderId}/${item.imagesId[0]}`

    return {
        title: item.title,
        description,
        openGraph: {
            title: `${item.title} - In Flames Closet`,
            description,
            images: [{ url: imageUrl, alt: item.title }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${item.title} - In Flames Closet`,
            description,
            images: [imageUrl],
        },
    }
}

/**
 * Item detail page - fetches item server-side and delegates rendering to the client component
 * @returns The item detail page, or a 404 not found response if the item doesn't exist
 */
export default async function IdPage({
    params,
}: {
    /** Parameters for the item detail page */
    readonly params: Promise<{
        /** The ID of the item */
        readonly id: string
    }>
}) {
    const { id } = await params
    const item = await database.getById(id)

    if (!item) {
        notFound()
    }

    return <ItemDetail item={item} />
}
