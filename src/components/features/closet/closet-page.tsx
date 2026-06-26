'use client'

import Link from 'next/link'
import { useOptimistic, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

import classNames from 'classnames'
import ItemCard from 'components/features/closet/item-card'
import ItemFilters from 'components/features/closet/item-filters'
import Pagination from 'components/ui/pagination'
import { buildClosetUrl, DEFAULT_FILTERS, filtersFromParams, type Filters } from 'lib/catalog/query'
// eslint-disable-next-line no-restricted-imports
import IconSvg from '../../../../public/favicon.svg'
import type { Item, Params } from 'lib/catalog/data'

interface ClosetPageProps {
    /** Items visible on the current page */
    readonly pagedItems: Array<Item>
    /** Total number of matching items */
    readonly total: number
    /** Total number of matching pages */
    readonly pages: number
    /** Total number of archived items, ignoring filters */
    readonly archivedCount: number
    /** All available filter options */
    readonly params: Params
}

/**
 * Main archive page - sticky header, filters sidebar, items grid and pagination.
 * Renders the server-filtered page and syncs filter state to the URL; navigation re-renders on the server.
 * @returns The rendered closet page with header, filters, items grid, pagination and footer
 */
export default function ClosetPage({ pagedItems, total, pages, archivedCount, params }: ClosetPageProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [isPending, startTransition] = useTransition()

    // The URL stays the source of truth, kept in sync by the server round-trip.
    // An optimistic overlay reflects checkbox, sort, and pagination changes instantly while that re-render lands.
    const urlFilters = filtersFromParams(searchParams)
    const [filters, setOptimisticFilters] = useOptimistic(urlFilters, (_current: Filters, next: Filters) => next)

    /**
     * Reflects the updated filters instantly (optimistically), then navigates to their URL so the server
     * re-renders the matching page; the optimistic value reverts to the URL once navigation commits.
     * @param next - New filter values to apply
     * @param type - Whether to push a new history entry or replace the current one (default: push)
     */
    function handleFiltersChange(next: Partial<Filters>, type: 'push' | 'replace' = 'push') {
        const updatedFilters = { ...filters, ...next }
        startTransition(() => {
            setOptimisticFilters(updatedFilters)
            router[type](buildClosetUrl(pathname, updatedFilters), { scroll: true })
        })
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
                        <div className="text-2xl font-display font-bold text-brand-500 tabular-nums">{archivedCount}</div>
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
                                            'opacity-50': isPending,
                                            'opacity-100': !isPending,
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
                                        filters={filters}
                                        onFiltersChange={next => {
                                            handleFiltersChange(next, 'push')
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
