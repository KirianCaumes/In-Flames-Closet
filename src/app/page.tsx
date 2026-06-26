import ClosetPage from 'components/features/closet/closet-page'
import { ClosetStructuredData } from 'components/structured-data'
import { fetchClosetFilters, fetchClosetItems } from 'lib/catalog/data'
import { applyClosetQuery, filtersFromParams } from 'lib/catalog/query'

// eslint-disable-next-line react-refresh/only-export-components
export const dynamic = 'force-dynamic'

/**
 * Converts Next.js route search params into URLSearchParams.
 * Array values are appended as repeated entries so multi-select filters survive the round trip.
 * @param searchParams Resolved Next.js search params.
 * @returns Equivalent URL search parameters.
 */
function toUrlSearchParams(searchParams: Record<string, string | Array<string> | undefined>): URLSearchParams {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(entry => {
                params.append(key, entry)
            })
        } else if (value !== undefined) {
            params.append(key, value)
        }
    })
    return params
}

/**
 * Home page - fetches all items server-side, filters/paginates them, and passes only the current page to the client.
 * @returns The rendered home page component
 */
export default async function Page({
    searchParams,
}: {
    /** Resolved URL search parameters. */
    readonly searchParams: Promise<Record<string, string | Array<string> | undefined>>
}) {
    const [resolvedSearchParams, [items, params]] = await Promise.all([
        searchParams,
        Promise.all([fetchClosetItems(), fetchClosetFilters()]).catch((error: unknown) => {
            // eslint-disable-next-line no-console
            console.error('Error fetching closet and/or filters:', error)
            return [[], { categories: [], links: [], years: [] }] as [
                Awaited<ReturnType<typeof fetchClosetItems>>,
                Awaited<ReturnType<typeof fetchClosetFilters>>,
            ]
        }),
    ])

    const filters = filtersFromParams(toUrlSearchParams(resolvedSearchParams))
    const { pagedItems, total, pages } = applyClosetQuery(items, filters)

    return (
        <>
            <ClosetStructuredData items={pagedItems} />
            <ClosetPage
                archivedCount={items.length}
                pagedItems={pagedItems}
                pages={pages}
                params={params}
                total={total}
            />
        </>
    )
}
