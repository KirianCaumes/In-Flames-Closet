'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import classNames from 'classnames'
import { useDebounce } from 'react-use'
import CategoryIcon from 'components/category-icon'
import albums from 'lib/albums'
import { DEFAULT_FILTERS, DEFAULT_LIMIT } from 'components/closet-page'
import type { Filters, Params } from 'lib/database'

interface ItemFiltersProps {
    /** Current filter values */
    readonly filters: Filters
    /** Available filter options */
    readonly params: Params
    /** Total number of matching results */
    readonly total: number
    /** Whether the filter panel is open by default (server-detected from User-Agent) */
    readonly defaultOpen: boolean
    /** Callback to update filters and sync to URL */
    readonly onFiltersChange: (next: Partial<Filters>, type: 'push' | 'replace' | null) => void
}

/**
 * Collapsible filter sidebar for the items archive.
 * Syncs state to URL query parameters via router.push.
 * @returns The rendered filter sidebar with sections for title search, linked albums, years and categories, and a sort dropdown.
 */
export default function ItemFilters({ filters, params, total, defaultOpen, onFiltersChange }: ItemFiltersProps) {
    const router = useRouter()
    const titleInputRef = useRef<HTMLInputElement>(null)
    const [debouncedTitle, setDebouncedTitle] = useState(filters.title)
    const isUserTypingTitle = useRef(false)

    const [isFiltersOpen, setIsFiltersOpen] = useState(defaultOpen)

    const [filterTypeOpen, setFilterTypeOpen] = useState<null | 'links' | 'categories'>('links')

    const buildUrl = useCallback(
        (partial: Record<string, string | Array<string> | number>): string => {
            const newParams = new URLSearchParams()
            const merged = { ...filters, ...partial }

            if (merged.page !== 1) {
                newParams.set('page', merged.page.toString())
            }
            if (merged.title) {
                newParams.set('title', merged.title)
            }
            if (merged.sort !== 'new') {
                newParams.set('sort', merged.sort)
            }
            merged.links.forEach(l => {
                newParams.append('links', l)
            })
            merged.years.forEach(y => {
                newParams.append('years', y)
            })
            merged.categories.forEach(c => {
                newParams.append('categories', c)
            })

            const qs = newParams.toString()
            return qs ? `/?${qs}` : '/'
        },
        [filters],
    )

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

    const isFiltered = Object.entries(filters).some(([key, value]) => {
        if (key === 'sort') {
            return false
        }
        if (key === 'page') {
            return value !== 1
        }
        if (Array.isArray(value)) {
            return value.length > 0
        }
        return value !== ''
    })

    return (
        <aside className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
            {/* Mobile toggle */}
            <div className="flex items-center justify-between">
                <button
                    className="lg:hidden flex items-center gap-1.5 cursor-pointer"
                    onClick={() => {
                        setIsFiltersOpen(prev => !prev)
                    }}
                    type="button"
                >
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Filters</span>
                    <svg
                        className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`}
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
                <h2 className="hidden lg:block text-xs font-semibold text-stone-400 uppercase tracking-widest">Filters</h2>

                <button
                    // eslint-disable-next-line max-len
                    className="text-xs text-brand-500 hover:text-brand-400 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-brand-500/10 cursor-pointer disabled:text-stone-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
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
                        <span className="text-xs text-stone-500">
                            {Math.min(DEFAULT_LIMIT, total)} of {total} result(s)
                        </span>
                        <select
                            // eslint-disable-next-line max-len
                            className="text-xs bg-stone-800 border border-stone-700 text-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-500 cursor-pointer"
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
                            className="block text-xs text-stone-400 font-medium mb-1"
                            htmlFor="filter-title"
                        >
                            Title
                        </label>
                        <div className="relative">
                            <input
                                // eslint-disable-next-line max-len
                                className="w-full bg-stone-800 border border-stone-700 text-stone-200 placeholder-stone-600 rounded-xl px-3 py-2 text-sm pr-9 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all [&::-webkit-calendar-picker-indicator]:!hidden"
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
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-brand-500 cursor-pointer"
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
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
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
                                className="w-full flex items-center justify-between text-xs font-medium text-stone-400 cursor-pointer hover:text-stone-200 transition-colors mb-0"
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
                                                        links: filters.links.includes(link)
                                                            ? filters.links.filter(x => x !== link)
                                                            : [...filters.links, link],
                                                        page: 1,
                                                    }),
                                                )
                                            }}
                                        >
                                            <input
                                                checked={filters.links.includes(link)}
                                                className="w-4 h-4 rounded border-stone-600 bg-stone-800 accent-brand-500 cursor-pointer min-w-4"
                                                onChange={({ target }) => {
                                                    onFiltersChange(
                                                        {
                                                            links: target.checked
                                                                ? [...filters.links, link]
                                                                : filters.links.filter(x => x !== link),
                                                            page: 1,
                                                        },
                                                        'push',
                                                    )
                                                }}
                                                type="checkbox"
                                            />
                                            {albums[link] ? (
                                                <Image
                                                    alt={link}
                                                    className="rounded-sm object-cover shrink-0"
                                                    height={16}
                                                    loading="lazy"
                                                    src={albums[link]}
                                                    width={16}
                                                />
                                            ) : (
                                                <svg
                                                    className="w-4 h-4 text-stone-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="9"
                                                        strokeWidth={2}
                                                    />
                                                    <path
                                                        d="M12 3c-3 4-3 14 0 18M12 3c3 4 3 14 0 18M3 12h18"
                                                        strokeLinecap="round"
                                                        strokeWidth={2}
                                                    />
                                                </svg>
                                            )}
                                            <span className="text-sm transition-colors truncate text-stone-400 group-hover:text-stone-200">
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
                                className="w-full flex items-center justify-between text-xs font-medium text-stone-400 cursor-pointer hover:text-stone-200 transition-colors mb-0"
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
                                                        categories: filters.categories.includes(category)
                                                            ? filters.categories.filter(x => x !== category)
                                                            : [...filters.categories, category],
                                                        page: 1,
                                                    }),
                                                )
                                            }}
                                        >
                                            <input
                                                checked={filters.categories.includes(category)}
                                                className="w-4 h-4 rounded border-stone-600 bg-stone-800 accent-brand-500 cursor-pointer"
                                                onChange={({ target }) => {
                                                    onFiltersChange(
                                                        {
                                                            categories: target.checked
                                                                ? [...filters.categories, category]
                                                                : filters.categories.filter(x => x !== category),
                                                            page: 1,
                                                        },
                                                        'push',
                                                    )
                                                }}
                                                type="checkbox"
                                            />
                                            <span className="transition-colors flex items-center text-stone-400 group-hover:text-stone-200">
                                                <CategoryIcon name={category} />
                                            </span>
                                            <span className="text-sm transition-colors text-stone-400 group-hover:text-stone-200">
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
