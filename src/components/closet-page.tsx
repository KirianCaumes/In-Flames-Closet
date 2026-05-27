'use client'

import Link from 'next/link'
import { useMemo, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

import ItemCard from 'components/item-card'
import ItemFilters from 'components/item-filters'
import Pagination from 'components/pagination'
// eslint-disable-next-line no-restricted-imports
import IconSvg from '../../public/favicon.svg'
import type { Filters, Item, Params } from 'lib/database'

const DEFAULT_LIMIT = 60

const DEFAULT_FILTERS: Filters = { page: 1, links: [], years: [], categories: [], sort: 'new', title: '' }

/**
 * Parses URL search parameters into a Filters object.
 * @param params The URLSearchParams from the current URL
 * @returns Filters object representing the current filter state
 */
function filtersFromParams(params: URLSearchParams): Filters {
    const page = Number.parseInt(params.get('page') ?? '', 10)
    return {
        page: Number.isNaN(page) ? 1 : page,
        links: params.getAll('links'),
        years: params.getAll('years'),
        categories: params.getAll('categories'),
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        sort: (params.get('sort') as Filters['sort']) ?? 'new',
        title: params.get('title') ?? '',
    }
}

/**
 * Converts a Filters object into a URL query string.
 * @param filters The current filter state
 * @returns A query string representing the filters (without leading `?`)
 */
function paramsFromFilters(filters: Filters): string {
    const params = new URLSearchParams()
    if (filters.page !== 1) {
        params.set('page', filters.page.toString())
    }
    if (filters.title) {
        params.set('title', filters.title)
    }
    if (filters.sort !== 'new') {
        params.set('sort', filters.sort)
    }
    filters.links.forEach(l => {
        params.append('links', l)
    })
    filters.years.forEach(y => {
        params.append('years', y)
    })
    filters.categories.forEach(c => {
        params.append('categories', c)
    })
    return params.toString()
}

interface ClosetPageProps {
    /** All items (unfiltered) */
    readonly items: Array<Item>
    /** All available filter options */
    readonly params: Params
    /** Detected device type for responsive rendering */
    readonly device: 'mobile' | 'desktop'
}

/**
 * Main archive page - sticky header, filters sidebar, items grid and pagination.
 * Reads URL search params, applies filters and pagination client-side.
 * @returns The rendered closet page with header, filters, items grid, pagination and footer
 */
export default function ClosetPage({ items, params, device }: ClosetPageProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [isPending, startTransition] = useTransition()
    const filters = filtersFromParams(searchParams)

    const { pagedItems, total, pages } = useMemo(() => {
        const { links, categories, years, sort, title, page } = filters

        let filtered = items.filter(
            item =>
                (links.length === 0 || links.includes(item.link)) &&
                (categories.length === 0 || categories.includes(item.category)) &&
                (years.length === 0 || years.includes(item.year)) &&
                (!title || item.title.toLowerCase().includes(title.toLowerCase())),
        )

        if (sort === 'old') {
            filtered = [...filtered].reverse()
        }

        const filteredTotal = filtered.length
        const filteredPages = Math.ceil(filteredTotal / DEFAULT_LIMIT)

        return {
            pagedItems: filtered.slice(DEFAULT_LIMIT * (page - 1), DEFAULT_LIMIT * page),
            total: filteredTotal,
            pages: filteredPages,
        }
    }, [items, filters])

    /**
     * Updates filters state and syncs the new filter values to the URL.
     * @param next - New filter values to apply
     */
    function handleFiltersChange(next: Filters) {
        const qs = paramsFromFilters(next)
        startTransition(() => {
            router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
        })
    }

    return (
        <>
            {/* ── Sticky header ──────────────────────────────────────── */}
            <header className="bg-stone-900/80 backdrop-blur-sm border-b border-stone-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <Image
                                alt="In Flames Closet"
                                className="w-12 h-12 object-cover shrink-0"
                                height={48}
                                loading="eager"
                                src={IconSvg as string}
                                width={48}
                            />
                        </Link>
                        <div className="w-px h-8 bg-gradient-to-b from-brand-500 to-brand-600 hidden sm:block" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-widest uppercase text-brand-500">In Flames</h1>
                            <p className="text-stone-400 text-xs sm:text-sm tracking-wide">Archive of the band's artworks</p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="text-2xl font-bold text-brand-500">{items.length}</div>
                        <div className="text-xs text-stone-400">items archived</div>
                    </div>
                </div>
            </header>

            {/* ── Main content ───────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar filters */}
                    <div className="w-full lg:w-64 xl:w-72 shrink-0">
                        <div className="sticky top-24">
                            <ItemFilters
                                defaultOpen={device === 'desktop'}
                                filters={filters}
                                limit={DEFAULT_LIMIT}
                                onFiltersChange={handleFiltersChange}
                                params={params}
                                total={total}
                            />
                        </div>
                    </div>

                    {/* Items grid */}
                    <div className="flex-1 min-w-0">
                        {pagedItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                                <svg
                                    className="w-12 h-12 text-stone-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                    />
                                </svg>
                                <p className="text-stone-400 font-medium">No items match your filters</p>
                                <button
                                    className="text-sm text-brand-500 hover:text-brand-400 underline underline-offset-2 transition-colors cursor-pointer"
                                    onClick={() => {
                                        handleFiltersChange(DEFAULT_FILTERS)
                                    }}
                                    type="button"
                                >
                                    Reset filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div
                                    // eslint-disable-next-line max-len
                                    className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity duration-150 ${isPending ? 'opacity-50' : 'opacity-100'}`}
                                >
                                    {pagedItems.map(item => (
                                        <ItemCard
                                            item={item}
                                            key={item.folderId}
                                        />
                                    ))}
                                </div>
                                <div className="mt-8">
                                    <Pagination
                                        filters={filters}
                                        pages={pages}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}
