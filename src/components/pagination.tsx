'use client'

import { useMemo } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import type { Filters } from 'lib/database'

interface PaginationProps {
    /** Current active filters (used to preserve them in page links) */
    readonly filters: Filters
    /** Total number of pages */
    readonly pages: number
}

/**
 * Builds a URL for a given page number, preserving current filters
 * @param pathname The base pathname for pagination links (e.g. "/")
 * @param params The current URL search params, used to preserve filters in pagination links
 * @param page The target page number for the pagination link
 * @returns A URL string for the pagination link to the given page, with filters preserved
 */
function buildPageUrl(pathname: string, params: URLSearchParams, page: number): string {
    const next = new URLSearchParams(params)
    if (page === 1) {
        next.delete('page')
    } else {
        next.set('page', String(page))
    }
    const qs = next.toString()
    return qs ? `${pathname}?${qs}` : pathname
}

/**
 * Tailwind pagination component that preserves all active filter params
 * @returns The pagination navigation element, or null if there's only one page
 */
export default function Pagination({ filters, pages }: PaginationProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const page = filters.page ?? 1

    const hasPrev = page > 1
    const hasNext = page < pages

    // Build visible page numbers (always show first, last and 2 neighbours)
    const visiblePages = useMemo(() => {
        const pagesList: Array<number | null> = []
        pagesList.push(1)
        if (page > 3) {
            pagesList.push(null) // Ellipsis
        }
        for (let p = Math.max(2, page - 1); p <= Math.min(pages - 1, page + 1); p++) {
            if (!pagesList.includes(p)) {
                pagesList.push(p)
            }
        }
        if (page < pages - 2) {
            pagesList.push(null) // Ellipsis
        }
        if (!pagesList.includes(pages)) {
            pagesList.push(pages)
        }
        return pagesList
    }, [page, pages])

    const arrowCls = (enabled: boolean) =>
        classNames('inline-flex items-center justify-center w-9 h-9 rounded-xl transition-colors', {
            'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white': enabled,
            'bg-stone-800/50 text-stone-600 cursor-not-allowed pointer-events-none': !enabled,
        })

    if (pages <= 1) {
        return null
    }

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-1.5 flex-wrap"
        >
            {hasPrev ? (
                <Link
                    aria-label="Previous page"
                    className={arrowCls(true)}
                    href={buildPageUrl(pathname, searchParams, page - 1)}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M15 19l-7-7 7-7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                        />
                    </svg>
                </Link>
            ) : (
                <span
                    aria-disabled="true"
                    className={arrowCls(false)}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M15 19l-7-7 7-7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                        />
                    </svg>
                </span>
            )}

            {visiblePages.map((p, i) =>
                p === null ? (
                    <span
                        className="text-stone-500 px-1"
                        // eslint-disable-next-line react/no-array-index-key
                        key={`ellipsis-${i}`}
                    >
                        …
                    </span>
                ) : (
                    <Link
                        aria-current={p === page ? 'page' : undefined}
                        aria-label={`Page ${p}`}
                        className={classNames(
                            'inline-flex items-center justify-center min-w-9 h-9 px-2 rounded-xl text-sm font-medium transition-colors',
                            {
                                'bg-brand-500 text-white': p === page,
                                'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white': p !== page,
                            },
                        )}
                        href={buildPageUrl(pathname, searchParams, p)}
                        key={p}
                    >
                        {p}
                    </Link>
                ),
            )}

            {hasNext ? (
                <Link
                    aria-label="Next page"
                    className={arrowCls(true)}
                    href={buildPageUrl(pathname, searchParams, page + 1)}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M9 5l7 7-7 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                        />
                    </svg>
                </Link>
            ) : (
                <span
                    aria-disabled="true"
                    className={arrowCls(false)}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M9 5l7 7-7 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                        />
                    </svg>
                </span>
            )}
        </nav>
    )
}
