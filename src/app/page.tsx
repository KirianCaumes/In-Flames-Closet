import ClosetPage from 'components/features/closet/closet-page'
import { ClosetStructuredData } from 'components/structured-data'
import { fetchClosetFilters, fetchClosetItems } from 'lib/catalog/data'

// eslint-disable-next-line react-refresh/only-export-components
export const dynamic = 'force-dynamic'

/**
 * Home page - fetches all items server-side and passes to the client archive component
 * @returns The rendered home page component
 */
export default async function Page() {
    const [items, params] = await Promise.all([fetchClosetItems(), fetchClosetFilters()]).catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching closet and/or filters:', error)
        return [[], { categories: [], links: [], years: [] }] as [
            Awaited<ReturnType<typeof fetchClosetItems>>,
            Awaited<ReturnType<typeof fetchClosetFilters>>,
        ]
    })

    return (
        <>
            <ClosetStructuredData items={items} />
            <ClosetPage
                items={items}
                params={params}
            />
        </>
    )
}
