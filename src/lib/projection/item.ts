import { buildAbsoluteImageUrl } from 'lib/image/identity'
import type { Item } from 'lib/catalog/data'
import type { Metadata } from 'next'

/** Metadata row shown on the closet item detail page. */
export interface ItemMetadataRow {
    /** Human label for the metadata row. */
    label: string
    /** Metadata value. */
    value: string
    /** Optional URL for filtered closet navigation. */
    href: string | null
}

/**
 * Builds Next.js metadata for a closet item.
 * @param item Closet item.
 * @param siteUrl Absolute site URL.
 * @returns Metadata for the item detail page.
 */
export function projectItemMetadata(item: Item, siteUrl: string): Metadata {
    const description = [item.title, item.category, item.year].filter(Boolean).join(' - ')
    const imageUrl = item.imagesId[0] ? buildAbsoluteImageUrl(siteUrl, { folderId: item.folderId, imageId: item.imagesId[0] }) : siteUrl

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
 * Builds the absolute detail URL for a closet item.
 * @param siteUrl Absolute site URL.
 * @param item Closet item.
 * @returns Sitemap/detail URL.
 */
export function buildItemDetailUrl(siteUrl: string, item: Item): string {
    return `${siteUrl}/${item.folderId}`
}
