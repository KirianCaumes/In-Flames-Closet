'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import classNames from 'classnames'
import { useDebounce } from 'react-use'
import { buildClosetUrl, DEFAULT_FILTERS, DEFAULT_LIMIT, hasActiveClosetFilters, toggleFilterValue, type Filters } from 'lib/catalog/query'
import { getAlbumDisplay, getCategoryDisplay } from 'lib/display/taxonomy'
import type { Params } from 'lib/catalog/data'

interface ItemFiltersProps {
    /** Current filter values */
    readonly filters: Filters
    /** Available filter options */
    readonly params: Params
    /** Total number of matching results */
    readonly total: number
    /** Callback to update filters and sync to URL */
    readonly onFiltersChange: (next: Partial<Filters>, type: 'push' | 'replace' | null) => void
}

/**
 * Collapsible filter sidebar for the items archive.
 * Syncs state to URL query parameters via router.push.
 * @returns The rendered filter sidebar with sections for title search, linked albums, years and categories, and a sort dropdown.
 */
export default function ItemFilters({ filters, params, total, onFiltersChange }: ItemFiltersProps) {
    const router = useRouter()
    const titleInputRef = useRef<HTMLInputElement>(null)
    const [debouncedTitle, setDebouncedTitle] = useState(filters.title)
    const isUserTypingTitle = useRef(false)

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const [filterTypeOpen, setFilterTypeOpen] = useState<null | 'links' | 'categories'>('links')

    const buildUrl = useCallback((partial: Partial<Filters>): string => buildClosetUrl('/', { ...filters, ...partial }), [filters])

    const reset = useCallback(() => {
        setDebouncedTitle('')
        onFiltersChange(DEFAULT_FILTERS, 'push')
    }, [onFiltersChange])

    // Debounce title input to avoid excessive URL updates while typing
    useDebounce(
        () => {
            isUserTypingTitle.current = false
            if (debouncedTitle !== filters.title) {
                // TODO test ca
                onFiltersChange({ title: debouncedTitle, page: 1 }, filters.title ? 'replace' : 'push')
            }
        },
        200,
        [debouncedTitle],
    )
    // Keep debouncedTitle in sync with external filters changes (e.g. when back/forward navigation)
    useEffect(() => {
        if (!isUserTypingTitle.current) {
            // eslint-disable-next-line react-you-might-not-need-an-effect/no-derived-state
            setDebouncedTitle(filters.title)
        }
    }, [filters.title])

    const isFiltered = hasActiveClosetFilters(filters)

    return (
        <aside className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            {/* Mobile toggle */}
            <div className="flex items-center justify-between">
                <button
                    className="lg:hidden flex items-center gap-1.5 cursor-pointer"
                    onClick={() => {
                        setIsFiltersOpen(prev => !prev)
                    }}
                    type="button"
                >
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Filters</p>
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M19 9l-7 7-7-7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                        />
                    </svg>
                </button>
                <p className="hidden lg:block text-xs font-display font-semibold text-gray-400 uppercase tracking-widest">Filters</p>

                <button
                    // eslint-disable-next-line max-len
                    className="text-xs text-brand-500 hover:text-brand-400 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-brand-500/10 cursor-pointer disabled:text-gray-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    disabled={!isFiltered}
                    onClick={reset}
                    type="button"
                >
                    Reset all
                </button>
            </div>

            {/* Filter body */}
            <div
                className={classNames(
                    'overflow-hidden transition-[max-height] duration-300 ease-in-out lg:!max-h-none',
                    isFiltersOpen ? 'max-h-[1200px]' : 'max-h-0',
                )}
            >
                <div className="space-y-4  mt-2">
                    {/* Results summary + sort */}
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-500">
                            {Math.min(DEFAULT_LIMIT, total)} of {total} result(s)
                        </span>
                        <select
                            // eslint-disable-next-line max-len
                            className="text-xs bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-500 cursor-pointer"
                            onChange={({ target }) => {
                                onFiltersChange({ sort: target.value as Filters['sort'], page: 1 }, 'push')
                            }}
                            value={filters.sort}
                        >
                            <option value="new">Newly added</option>
                            <option value="old">Formerly added</option>
                        </select>
                    </div>

                    {/* Title search */}
                    <div>
                        <label
                            className="block text-xs text-gray-400 font-medium mb-1"
                            htmlFor="filter-title"
                        >
                            Title
                        </label>
                        <div className="relative">
                            <input
                                // eslint-disable-next-line max-len
                                className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-600 rounded-xl px-3 py-2 text-sm pr-9 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all [&::-webkit-calendar-picker-indicator]:!hidden"
                                id="filter-title"
                                onChange={({ target }) => {
                                    isUserTypingTitle.current = true
                                    setDebouncedTitle(target.value)
                                }}
                                placeholder="Search title..."
                                ref={titleInputRef}
                                type="text"
                                value={debouncedTitle}
                            />
                            {filters.title ? (
                                <button
                                    aria-label={`Clear ${filters.title.toLowerCase()}`}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 cursor-pointer"
                                    onClick={() => {
                                        onFiltersChange({ title: '', page: 1 }, 'push')
                                    }}
                                    type="button"
                                >
                                    <svg
                                        className="w-4 h-4"
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
                            ) : (
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                        />
                                    </svg>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Linked to (album) */}
                    {params.links.length > 0 && (
                        <>
                            <button
                                // eslint-disable-next-line max-len
                                className="w-full flex items-center justify-between text-xs font-medium text-gray-400 cursor-pointer hover:text-gray-200 transition-colors mb-0"
                                onClick={() => {
                                    setFilterTypeOpen(prev => (prev === 'links' ? null : 'links'))
                                }}
                                type="button"
                            >
                                <span>Linked to</span>
                                <svg
                                    className={classNames(
                                        'w-3.5 h-3.5 transition-transform duration-200',
                                        filterTypeOpen === 'links' ? 'rotate-180' : '',
                                    )}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M19 9l-7 7-7-7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                            </button>
                            <div
                                className={classNames(
                                    'overflow-hidden transition-[max-height] duration-300 ease-in-out',
                                    filterTypeOpen === 'links' ? 'max-h-[1200px]' : 'max-h-0',
                                )}
                            >
                                <div className="space-y-1.5 pt-2">
                                    {params.links.map(link => (
                                        <label
                                            className="flex items-center gap-2 group cursor-pointer"
                                            key={link}
                                            onMouseEnter={() => {
                                                router.prefetch(
                                                    buildUrl({
                                                        links: toggleFilterValue(filters.links, link),
                                                        page: 1,
                                                    }),
                                                )
                                            }}
                                        >
                                            <input
                                                checked={filters.links.includes(link)}
                                                className="w-4 h-4 rounded border-gray-600 bg-gray-800 accent-brand-500 cursor-pointer min-w-4"
                                                onChange={() => {
                                                    onFiltersChange(
                                                        {
                                                            links: toggleFilterValue(filters.links, link),
                                                            page: 1,
                                                        },
                                                        'push',
                                                    )
                                                }}
                                                type="checkbox"
                                            />
                                            {getAlbumDisplay(link).icon}
                                            <span className="text-sm transition-colors truncate text-gray-400 group-hover:text-gray-200">
                                                {link}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Categories */}
                    {params.categories.length > 0 && (
                        <>
                            <button
                                // eslint-disable-next-line max-len
                                className="w-full flex items-center justify-between text-xs font-medium text-gray-400 cursor-pointer hover:text-gray-200 transition-colors mb-0"
                                onClick={() => {
                                    setFilterTypeOpen(prev => (prev === 'categories' ? null : 'categories'))
                                }}
                                type="button"
                            >
                                <span>Categories</span>
                                <svg
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${filterTypeOpen === 'categories' ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M19 9l-7 7-7-7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                            </button>
                            <div
                                className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                                    filterTypeOpen === 'categories' ? 'max-h-[1200px]' : 'max-h-0'
                                }`}
                            >
                                <div className="space-y-1.5 pt-2">
                                    {params.categories.map(category => (
                                        <label
                                            className="flex items-center gap-2 group cursor-pointer"
                                            key={category}
                                            onMouseEnter={() => {
                                                router.prefetch(
                                                    buildUrl({
                                                        categories: toggleFilterValue(filters.categories, category),
                                                        page: 1,
                                                    }),
                                                )
                                            }}
                                        >
                                            <input
                                                checked={filters.categories.includes(category)}
                                                className="w-4 h-4 rounded border-gray-600 bg-gray-800 accent-brand-500 cursor-pointer"
                                                onChange={() => {
                                                    onFiltersChange(
                                                        {
                                                            categories: toggleFilterValue(filters.categories, category),
                                                            page: 1,
                                                        },
                                                        'push',
                                                    )
                                                }}
                                                type="checkbox"
                                            />
                                            <span className="transition-colors flex items-center text-gray-400 group-hover:text-gray-200">
                                                {getCategoryDisplay(category).icon}
                                            </span>
                                            <span className="text-sm transition-colors text-gray-400 group-hover:text-gray-200">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </aside>
    )
}
