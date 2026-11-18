'use client'

import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buildClosetUrl, getVisiblePages } from 'lib/catalog/query'
import type { MouseEvent } from 'react'
import type { Filters } from 'lib/catalog/query'

interface PaginationProps {
    /** Total number of pages */
    readonly pages: number
    /** Current filters (optimistic) used to mark the active page and preserve filters in page links */
    readonly filters: Filters
    /** Callback to update filters and sync to URL */
    readonly onFiltersChange: (next: Partial<Filters>) => void
}

/**
 * Tailwind pagination component that preserves all active filter params
 * @returns The pagination navigation element, or null if there's only one page
 */
export default function Pagination({ pages, filters, onFiltersChange }: PaginationProps) {
    const pathname = usePathname()

    const page = filters.page

    const hasPrev = page > 1
    const hasNext = page < pages

    // Build visible page numbers (always show first, last and 2 neighbours)
    const visiblePages = getVisiblePages(page, pages)

    /**
     * Drives page navigation through the parent transition so the grid dims while loading.
     * Modifier and non-primary clicks fall through to the link href so open-in-new-tab keeps working.
     * @param event Click event from the page link.
     * @param targetPage Page to navigate to.
     */
    const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, targetPage: number) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
            return
        }
        window.scrollTo({ top: 0, behavior: 'instant' })
        event.preventDefault()
        onFiltersChange({ page: targetPage })
    }

    if (pages <= 1) {
        return null
    }

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-1 flex-wrap text-[13px] tabular-nums"
        >
            {hasPrev && (
                <Link
                    aria-label="Previous page"
                    className="inline-flex items-center justify-center min-w-11 h-11 px-3 rounded-lg text-gray-100 hover:text-white transition-colors"
                    href={buildClosetUrl(pathname, { ...filters, page: page - 1 })}
                    onClick={event => {
                        handleNavigate(event, page - 1)
                    }}
                >
                    Previous
                </Link>
            )}

            {visiblePages.map((p, i) =>
                p === null ? (
                    <span
                        className="inline-flex items-center justify-center min-w-8 h-11 text-gray-400"
                        // eslint-disable-next-line react/no-array-index-key
                        key={`ellipsis-${i}`}
                    >
                        …
                    </span>
                ) : (
                    <Link
                        aria-current={p === page ? 'page' : undefined}
                        aria-label={`Page ${p}`}
                        className={classNames('inline-flex items-center justify-center min-w-11 h-11 px-2 rounded-lg transition-colors', {
                            'border border-brand-500 text-brand-500': p === page,
                            'text-gray-400 hover:text-gray-100': p !== page,
                        })}
                        href={buildClosetUrl(pathname, { ...filters, page: p })}
                        key={p}
                        onClick={event => {
                            handleNavigate(event, p)
                        }}
                        scroll
                    >
                        {p}
                    </Link>
                ),
            )}

            {hasNext && (
                <Link
                    aria-label="Next page"
                    className="inline-flex items-center justify-center min-w-11 h-11 px-3 rounded-lg text-gray-100 hover:text-white transition-colors"
                    href={buildClosetUrl(pathname, { ...filters, page: page + 1 })}
                    onClick={event => {
                        handleNavigate(event, page + 1)
                    }}
                >
                    Next
                </Link>
            )}
        </nav>
    )
}
