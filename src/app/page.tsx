import { headers } from 'next/headers'
import database from 'lib/database'
import ClosetPage from 'components/closet-page'

/**
 * Home page - fetches all items server-side and passes to the client archive component
 * @returns The rendered home page component
 */
export default async function Page() {
    const ua = (await headers()).get('user-agent') ?? ''
    const device = /mobile|android|iphone|ipad|ipod/i.test(ua) ? 'mobile' : 'desktop'

    const [items, params] = await Promise.all([database.getItems(), database.getParams()])

    return (
        <ClosetPage
            device={device}
            items={items}
            params={params}
        />
    )
}
