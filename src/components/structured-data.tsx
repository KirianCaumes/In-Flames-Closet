import { buildAbsoluteImageUrl } from 'lib/image/identity'
import { buildItemDetailUrl } from 'lib/projection/item'
import type { Item } from 'lib/catalog/data'

const SITE_URL = process.env.SITE_URL ?? 'https://in-flames-closet.kiriancaumes.fr'

const SITE_DESCRIPTION =
    // eslint-disable-next-line max-len
    'An archive of In Flames artworks throughout the years: clothes, goodies, and more. Explore the history of the band through their merchandise and official products.'

/** Reference to the In Flames MusicGroup node shared across the graph. */
const BAND_REF = { '@id': `${SITE_URL}/#band` }

/**
 * Builds the schema.org `Product` node for one closet item.
 * @param item Closet item.
 * @returns Product structured-data node.
 */
function buildProduct(item: Item): Record<string, unknown> {
    return {
        '@type': 'Product',
        name: item.title || 'Unknown',
        url: buildItemDetailUrl(SITE_URL, item),
        ...(item.imagesId[0] && { image: buildAbsoluteImageUrl(SITE_URL, { folderId: item.folderId, imageId: item.imagesId[0] }) }),
        ...(item.category && { category: item.category }),
        ...(item.year && { releaseDate: item.year }),
        brand: { '@type': 'MusicGroup', name: 'In Flames' },
    }
}

/**
 * Serializes a JSON-LD graph into a `<script type="application/ld+json">` element.
 * @returns The structured-data script element.
 */
function JsonLdScript({
    graph,
}: {
    /** Schema.org graph object to serialize. */
    readonly graph: Record<string, unknown>
}) {
    return (
        <script
            // The `<` escape prevents the JSON from prematurely closing the surrounding <script> tag.
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
            type="application/ld+json"
        />
    )
}

/**
 * Renders JSON-LD structured data for the closet home page (WebSite + MusicGroup + CollectionPage/ItemList).
 * @returns The structured-data script element.
 */
export function ClosetStructuredData({
    items,
}: {
    /** All closet items in display order. */
    readonly items: Array<Item>
}) {
    const graph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                url: `${SITE_URL}/`,
                name: 'In Flames Closet',
                description: SITE_DESCRIPTION,
                publisher: BAND_REF,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?title={search_term_string}` },
                    'query-input': 'required name=search_term_string',
                },
            },
            {
                '@type': 'MusicGroup',
                '@id': `${SITE_URL}/#band`,
                name: 'In Flames',
                genre: 'Melodic death metal',
                foundingDate: '1990',
                foundingLocation: { '@type': 'Place', name: 'Gothenburg, Sweden' },
            },
            {
                '@type': 'CollectionPage',
                '@id': `${SITE_URL}/#webpage`,
                url: `${SITE_URL}/`,
                name: "In Flames Closet - Archive of the band's artworks",
                description: SITE_DESCRIPTION,
                isPartOf: { '@id': `${SITE_URL}/#website` },
                about: BAND_REF,
                mainEntity: {
                    '@type': 'ItemList',
                    numberOfItems: items.length,
                    itemListElement: items.map((item, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        item: buildProduct(item),
                    })),
                },
            },
        ],
    }

    return <JsonLdScript graph={graph} />
}

/**
 * Renders JSON-LD structured data for a single closet item detail page (BreadcrumbList + Product).
 * @returns The structured-data script element.
 */
export function ItemStructuredData({
    item,
}: {
    /** Closet item shown on the page. */
    readonly item: Item
}) {
    const images = item.imagesId.map(imageId => buildAbsoluteImageUrl(SITE_URL, { folderId: item.folderId, imageId }))
    const description = [item.title, item.category, item.year].filter(Boolean).join(' - ')

    const graph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
                    { '@type': 'ListItem', position: 2, name: item.title || 'Unknown', item: buildItemDetailUrl(SITE_URL, item) },
                ],
            },
            {
                '@type': 'Product',
                name: item.title || 'Unknown',
                url: buildItemDetailUrl(SITE_URL, item),
                ...(images.length > 0 && { image: images }),
                ...(description && { description }),
                ...(item.category && { category: item.category }),
                ...(item.year && { releaseDate: item.year }),
                brand: { '@type': 'MusicGroup', name: 'In Flames' },
                ...(item.link && { isRelatedTo: { '@type': 'MusicAlbum', name: item.link } }),
            },
        ],
    }

    return <JsonLdScript graph={graph} />
}
