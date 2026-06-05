import { headers } from 'next/headers'
import ClosetPage from 'components/features/closet/closet-page'
import { fetchClosetFilters, fetchClosetItems } from 'lib/catalog/data'

/**
 * Home page - fetches all items server-side and passes to the client archive component
 * @returns The rendered home page component
 */
export default async function Page() {
    const ua = (await headers()).get('user-agent') ?? ''
    const device = /mobile|android|iphone|ipad|ipod/i.test(ua) ? 'mobile' : 'desktop'

    const [items, params] = await Promise.all([fetchClosetItems(), fetchClosetFilters()]).catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching closet and/or filters:', error)
        return [[], { categories: [], links: [], years: [] }] as [
            Awaited<ReturnType<typeof fetchClosetItems>>,
            Awaited<ReturnType<typeof fetchClosetFilters>>,
        ]
    })

    return (
        <ClosetPage
            device={device}
            items={items}
            params={params}
        />
    )
}
