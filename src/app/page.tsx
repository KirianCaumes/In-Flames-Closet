import { headers } from 'next/headers'
import database from 'lib/database'
import ClosetPage from 'components/closet-page'
import type { Filters } from 'lib/database'

/**
 * Parse and validate URL search params into a Filters
 * @param params The raw URL search params from the request
 * @returns A Filters object with validated and defaulted filter values
 */
function parseFilters(params: Record<string, string | Array<string> | undefined>): Filters {
    const page = Number.parseInt(params.page as string, 10)
    const raw = (key: string) => {
        const v = params[key]
        if (!v) {
            return []
        }
        return Array.isArray(v) ? v : [v]
    }

    return {
        page: Number.isNaN(page) ? 1 : page,
        links: raw('links'),
        years: raw('years'),
        categories: raw('categories'),
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        sort: (params.sort as Filters['sort']) ?? 'new',
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        title: (params.title as string) ?? '',
    }
}

/**
 * Home page - fetches items server-side and passes to the client archive component
 * @returns The rendered home page component
 */
export default async function Page({
    searchParams,
}: {
    /** The URL search params from the request */
    readonly searchParams: Promise<Record<string, string | Array<string> | undefined>>
}) {
    const params = await searchParams
    const filters = parseFilters(params)
    const ua = (await headers()).get('user-agent') ?? ''
    const device = /mobile|android|iphone|ipad|ipod/i.test(ua) ? 'mobile' : 'desktop'

    const [{ items, pages, total, limit, totalAll }, dbParams] = await Promise.all([database.getAll(filters), database.getParams()])

    return (
        <ClosetPage
            device={device}
            filters={filters}
            items={items}
            limit={limit}
            pages={pages}
            params={dbParams}
            total={total}
            totalAll={totalAll}
        />
    )
}
