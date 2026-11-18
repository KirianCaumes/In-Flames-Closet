'use client'

import { useOptimistic, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import classNames from 'classnames'
import ItemCard from 'components/features/closet/item-card'
import ItemFilters from 'components/features/closet/item-filters'
import SiteHeader from 'components/layout/site-header'
import Pagination from 'components/ui/pagination'
import { buildClosetUrl, DEFAULT_FILTERS, filtersFromParams, type Filters } from 'lib/catalog/query'
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
 * Main archive page - header, hero with counts, release strip, filters toolbar, items grid and pagination.
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
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12 flex flex-col gap-7 text-sm">
                <section className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
                    <div className="max-w-160">
                        <h1 className="font-display font-semibold text-[34px] leading-[1.15] text-gray-50">Merch &amp; artwork archive</h1>
                        <p className="mt-2 text-[15px] leading-[1.55] text-gray-400">
                            The history of In Flames through their artworks: clothes, goodies, and more.
                        </p>
                    </div>
                    <dl className="flex">
                        <div className="flex flex-col-reverse gap-0.5 pr-5">
                            <dt className="text-xs text-gray-400">Items</dt>
                            <dd className="text-xl font-medium tabular-nums text-gray-100">{archivedCount}</dd>
                        </div>
                        <div className="flex flex-col-reverse gap-0.5 pl-5 border-l border-gray-800">
                            <dt className="text-xs text-gray-400">Releases</dt>
                            <dd className="text-xl font-medium tabular-nums text-gray-100">{params.links.length}</dd>
                        </div>
                    </dl>
                </section>

                <ItemFilters
                    archivedCount={archivedCount}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    params={params}
                    shown={pagedItems.length}
                    total={total}
                />

                <h2 className="sr-only">Items</h2>
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
                                'grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-7 transition-opacity duration-150',
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
                        <Pagination
                            filters={filters}
                            onFiltersChange={next => {
                                handleFiltersChange(next, 'push')
                            }}
                            pages={pages}
                        />
                    </>
                )}
            </main>
        </>
    )
}
