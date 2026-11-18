'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import classNames from 'classnames'
import { buildClosetUrl, DEFAULT_FILTERS, hasActiveClosetFilters, toggleFilterValue, type Filters } from 'lib/catalog/query'
import { getAlbumDisplay } from 'lib/display/taxonomy'
import type { Params } from 'lib/catalog/data'

interface ItemFiltersProps {
    /** Current filter values */
    readonly filters: Filters
    /** Available filter options */
    readonly params: Params
    /** Number of results shown on the current page */
    readonly shown: number
    /** Total number of matching results */
    readonly total: number
    /** Total number of archived items, ignoring filters */
    readonly archivedCount: number
    /** Callback to update filters and sync to URL */
    readonly onFiltersChange: (next: Partial<Filters>, type: 'push' | 'replace') => void
}

/** On wide screens the release buttons shrink so the whole strip fits on one line. */
const RELEASE_BUTTON = 'shrink-0 xl:shrink xl:flex-1 xl:min-w-0 xl:max-w-13 flex flex-col items-center gap-1'
const RELEASE_TILE = 'size-13 xl:w-full xl:h-auto xl:aspect-square rounded-lg border-2'

/**
 * Release strip, search / sort toolbar and category chips for the items archive.
 * Syncs state to URL query parameters via router.push.
 * @returns The rendered release strip and filters toolbar.
 */
export default function ItemFilters({ filters, params, shown, total, archivedCount, onFiltersChange }: ItemFiltersProps) {
    const router = useRouter()

    const buildUrl = useCallback((partial: Partial<Filters>): string => buildClosetUrl('/', { ...filters, ...partial }), [filters])

    const reset = useCallback(() => {
        onFiltersChange(DEFAULT_FILTERS, 'push')
    }, [onFiltersChange])

    const isFiltered = hasActiveClosetFilters(filters)

    return (
        <>
            {params.links.length > 0 && (
                <section className="flex flex-col gap-2.5 pt-5 border-t border-gray-800">
                    <h2 className="text-[13px] font-medium text-gray-400">Browse by release</h2>
                    <div className="flex flex-wrap xl:flex-nowrap gap-x-2 gap-y-3 text-[11px] text-gray-400 text-center tabular-nums">
                        <button
                            aria-pressed={filters.links.length === 0}
                            className={`${RELEASE_BUTTON} text-gray-100 cursor-pointer`}
                            onClick={() => {
                                onFiltersChange({ links: [], page: 1 }, 'push')
                            }}
                            type="button"
                        >
                            <span
                                className={classNames(
                                    `${RELEASE_TILE} flex items-center justify-center text-[13px] font-medium`,
                                    filters.links.length === 0 ? 'border-brand-500' : 'border-gray-700',
                                )}
                            >
                                All
                            </span>
                            <span>{archivedCount}</span>
                        </button>
                        {/* Releases without a cover first */}
                        {params.links
                            .toSorted((a, b) => Number(!!getAlbumDisplay(a).cover) - Number(!!getAlbumDisplay(b).cover))
                            .map(link => {
                                const album = getAlbumDisplay(link)
                                const isActive = filters.links.includes(link)
                                return (
                                    <button
                                        aria-pressed={isActive}
                                        className={classNames(`${RELEASE_BUTTON} cursor-pointer hover:text-gray-100 transition-colors`, {
                                            'text-gray-100': isActive,
                                        })}
                                        key={link}
                                        onClick={() => {
                                            onFiltersChange({ links: toggleFilterValue(filters.links, link), page: 1 }, 'push')
                                        }}
                                        onMouseEnter={() => {
                                            router.prefetch(buildUrl({ links: toggleFilterValue(filters.links, link), page: 1 }))
                                        }}
                                        title={link}
                                        type="button"
                                    >
                                        {album.cover ? (
                                            <Image
                                                alt={link}
                                                className={classNames(
                                                    `${RELEASE_TILE} object-cover`,
                                                    isActive ? 'border-brand-500' : 'border-transparent',
                                                )}
                                                height={52}
                                                src={album.cover}
                                                width={52}
                                            />
                                        ) : (
                                            <span
                                                className={classNames(
                                                    `${RELEASE_TILE} bg-gray-900 flex items-center justify-center p-1 leading-tight`,
                                                    isActive ? 'border-brand-500' : 'border-gray-800',
                                                )}
                                            >
                                                {album.shortLabel}
                                            </span>
                                        )}
                                        <span>{album.year}</span>
                                    </button>
                                )
                            })}
                    </div>
                </section>
            )}

            <section
                aria-label="Search and filters"
                className="flex flex-wrap items-center gap-3"
            >
                <div className="relative flex-[999_1_280px] min-w-0">
                    <label
                        className="sr-only"
                        htmlFor="filter-title"
                    >
                        Search items
                    </label>
                    <svg
                        aria-hidden="true"
                        className="absolute left-3.5 top-3.5 size-4 text-gray-400 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                    >
                        <circle
                            cx="11"
                            cy="11"
                            r="6.5"
                        />
                        <path d="M16 16l4.5 4.5" />
                    </svg>
                    <input
                        // eslint-disable-next-line max-len
                        className="w-full h-11 pl-10 pr-11 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-brand-500 [&::-webkit-calendar-picker-indicator]:!hidden"
                        id="filter-title"
                        onChange={({ target }) => {
                            onFiltersChange({ title: target.value, page: 1 }, filters.title ? 'replace' : 'push')
                        }}
                        placeholder="Search a title, e.g. jesterhead"
                        type="text"
                        value={filters.title}
                    />
                    {filters.title && (
                        <button
                            aria-label={`Clear ${filters.title.toLowerCase()}`}
                            className="absolute right-0 top-0 size-11 flex items-center justify-center text-gray-400 hover:text-gray-100 cursor-pointer"
                            onClick={() => {
                                onFiltersChange({ title: '', page: 1 }, 'push')
                            }}
                            type="button"
                        >
                            <svg
                                className="size-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M6 18L18 6M6 6l12 12"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="flex-[1_1_170px]">
                    <label
                        className="sr-only"
                        htmlFor="filter-sort"
                    >
                        Sort
                    </label>
                    <select
                        // eslint-disable-next-line max-len
                        className="w-full h-11 px-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-brand-500 cursor-pointer"
                        id="filter-sort"
                        onChange={({ target }) => {
                            onFiltersChange({ sort: target.value as Filters['sort'], page: 1 }, 'push')
                        }}
                        value={filters.sort}
                    >
                        <option value="new">Newly added</option>
                        <option value="old">Formerly added</option>
                    </select>
                </div>

                <p className="text-[13px] text-gray-400 whitespace-nowrap">
                    <span className="tabular-nums text-gray-100">{shown}</span> of <span className="tabular-nums">{total}</span> items
                </p>

                {isFiltered && (
                    <button
                        className="min-h-11 text-[13px] text-brand-500 hover:text-brand-400 transition-colors cursor-pointer"
                        onClick={reset}
                        type="button"
                    >
                        Reset filters
                    </button>
                )}

                {params.categories.length > 0 && (
                    <div
                        aria-label="Categories"
                        className="basis-full flex flex-wrap gap-2"
                        role="group"
                    >
                        {params.categories.map(category => {
                            const isActive = filters.categories.includes(category)
                            return (
                                <button
                                    aria-pressed={isActive}
                                    className={classNames(
                                        'min-h-11 px-3 rounded border text-[13px] transition-colors cursor-pointer',
                                        isActive ? 'border-brand-500 text-brand-500' : 'border-gray-800 text-gray-400 hover:text-gray-100',
                                    )}
                                    key={category}
                                    onClick={() => {
                                        onFiltersChange({ categories: toggleFilterValue(filters.categories, category), page: 1 }, 'push')
                                    }}
                                    onMouseEnter={() => {
                                        router.prefetch(buildUrl({ categories: toggleFilterValue(filters.categories, category), page: 1 }))
                                    }}
                                    type="button"
                                >
                                    {category}
                                </button>
                            )
                        })}
                    </div>
                )}
            </section>
        </>
    )
}
