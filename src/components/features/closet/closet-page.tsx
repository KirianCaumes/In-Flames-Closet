'use client'

import Link from 'next/link'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

import classNames from 'classnames'
import ItemCard from 'components/features/closet/item-card'
import ItemFilters from 'components/features/closet/item-filters'
import Pagination from 'components/ui/pagination'
import { applyClosetQuery, areFiltersEqual, buildClosetUrl, DEFAULT_FILTERS, filtersFromParams, type Filters } from 'lib/catalog/query'
// eslint-disable-next-line no-restricted-imports
import IconSvg from '../../../../public/favicon.svg'
import type { Item, Params } from 'lib/catalog/data'

interface ClosetPageProps {
    /** All items (unfiltered) */
    readonly items: Array<Item>
    /** All available filter options */
    readonly params: Params
}

/**
 * Main archive page - sticky header, filters sidebar, items grid and pagination.
 * Reads URL search params, applies filters and pagination client-side.
 * @returns The rendered closet page with header, filters, items grid, pagination and footer
 */
export default function ClosetPage({ items, params }: ClosetPageProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [filters, setFilters] = useState<Filters>(() => filtersFromParams(searchParams))
    const deferredFilters = useDeferredValue(filters)
    const isStale = filters !== deferredFilters

    // Sync filters when URL changes (e.g., browser back/forward navigation)
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilters(prev => {
            const newFilters = filtersFromParams(searchParams)
            // Only update if filters actually changed
            if (areFiltersEqual(prev, newFilters)) {
                return prev
            }
            return newFilters
        })
    }, [searchParams])

    const { pagedItems, total, pages } = useMemo(() => applyClosetQuery(items, deferredFilters), [items, deferredFilters])

    /**
     * Updates filters state and syncs the new filter values to the URL.
     * @param next - New filter values to apply
     * @param type - Whether to push a new history entry or replace the current one (default: push)
     */
    function handleFiltersChange(next: Partial<Filters>, type: 'push' | 'replace' | null = 'push') {
        const updatedFilters = { ...filters, ...next }
        setFilters(updatedFilters)
        if (type) {
            router[type](buildClosetUrl(pathname, updatedFilters), { scroll: true })
        }
    }

    return (
        <>
            {/* ── Sticky header ──────────────────────────────────────── */}
            <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
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
                        <h1 className="leading-tight">
                            <span className="block text-xl sm:text-2xl font-display font-bold tracking-wide uppercase text-brand-500">
                                In Flames
                            </span>
                            <span className="block text-gray-400 text-xs sm:text-sm tracking-wide font-normal">
                                Archive of the band's artworks
                            </span>
                        </h1>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="text-2xl font-display font-bold text-brand-500 tabular-nums">{items.length}</div>
                        <div className="text-xs text-gray-400">items archived</div>
                    </div>
                </div>
            </header>

            {/* ── Main content ───────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <h2 className="sr-only">Browse the In Flames merch &amp; artwork archive</h2>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar filters */}
                    <div className="w-full lg:w-64 xl:w-72 shrink-0">
                        <div className="sticky top-24">
                            <ItemFilters
                                filters={filters}
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
                                    className="w-12 h-12 text-gray-700"
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
                                <p className="text-gray-400 font-medium">No items match your filters</p>
                                <button
                                    className="text-sm text-brand-500 hover:text-brand-400 underline underline-offset-2 transition-colors cursor-pointer"
                                    onClick={() => {
                                        handleFiltersChange(DEFAULT_FILTERS, 'push')
                                    }}
                                    type="button"
                                >
                                    Reset filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div
                                    className={classNames(
                                        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity duration-150',
                                        {
                                            'opacity-50': isStale,
                                            'opacity-100': !isStale,
                                        },
                                    )}
                                >
                                    {pagedItems.map((item, i) => (
                                        <ItemCard
                                            item={item}
                                            key={item.folderId}
                                            priority={i === 0}
                                        />
                                    ))}
                                </div>
                                <div className="mt-8">
                                    <Pagination
                                        onFiltersChange={next => {
                                            handleFiltersChange({ ...filters, ...next }, null)
                                        }}
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
