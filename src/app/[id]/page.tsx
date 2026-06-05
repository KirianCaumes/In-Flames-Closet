import { notFound } from 'next/navigation'
import ItemDetail from 'components/features/item-detail/item-detail'
import { fetchClosetItems } from 'lib/catalog/data'
import { projectItemMetadata } from 'lib/projection/item'
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
    const item = await findClosetItem(id)
    if (!item) {
        return { title: 'Item not found' }
    }

    return projectItemMetadata(item, process.env.SITE_URL ?? '')
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
    const item = await findClosetItem(id)

    if (!item) {
        notFound()
    }

    return <ItemDetail item={item} />
}

/**
 * Finds one closet item by folder ID.
 * @param id Folder ID.
 * @returns Matching closet item or null.
 */
async function findClosetItem(id: string) {
    const items = await fetchClosetItems()
    return items.find(item => item.folderId === id) ?? null
}
