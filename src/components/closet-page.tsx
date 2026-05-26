'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import ItemCard from 'components/item-card'
import ItemFilters from 'components/item-filters'
import Pagination from 'components/pagination'
// eslint-disable-next-line no-restricted-imports
import IconSvg from '../../public/favicon.svg'
import type { Filters, ItemsResult, Params } from 'lib/database'

interface ClosetPageProps extends Pick<ItemsResult, 'items' | 'total' | 'pages' | 'limit'> {
    /** Active filters */
    readonly filters: Filters
    /** All available filter options */
    readonly params: Params
    /** Detected device type for responsive rendering */
    readonly device: 'mobile' | 'desktop'
    /** Total number of all items */
    readonly totalAll: number
}

/**
 * Main archive page - sticky header, filters sidebar, items grid and pagination.
 * Receives SSR-fetched data and handles client-side navigation (URL-driven).
 * @returns The rendered closet page with header, filters, items grid, pagination and footer
 */
export default function ClosetPage({ items, total, pages, limit, filters, params, device, totalAll }: ClosetPageProps) {
    const router = useRouter()

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
                        <div className="text-2xl font-bold text-brand-500">{totalAll}</div>
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
                                limit={limit}
                                params={params}
                                total={total}
                            />
                        </div>
                    </div>

                    {/* Items grid */}
                    <div className="flex-1 min-w-0">
                        {items.length === 0 ? (
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
                                        router.push('/')
                                    }}
                                    type="button"
                                >
                                    Reset filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {items.map(item => (
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
