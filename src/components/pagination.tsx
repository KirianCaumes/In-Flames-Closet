import React from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

declare module 'react' {
    // eslint-disable-next-line
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        /** Disabled */
        disabled?: boolean
    }
}

/**
 * Pagination
 */
export default function Pagination({ page = 1, pages = 1 }: {
    /** page */
    page: number
    /** pages */
    pages: number
}) {
    const router = useRouter()

    return (
        <nav
            className="pagination"
            role="navigation"
            aria-label="pagination"
        >
            {page <= 1
                ? (
                    <a
                        className="pagination-previous"
                        disabled
                    >
                        Previous
                    </a>
                )
                : (
                    <Link
                        href={{
                            query: {
                                ...router.query,
                                page: page - 1,
                            },
                        }}
                        scroll
                    >
                        <a
                            className="pagination-previous"
                        >
                            Previous
                        </a>
                    </Link>
                )}
            {page >= pages
                ? (
                    <a
                        className="pagination-next"
                        disabled
                    >
                        Next
                    </a>
                )
                : (
                    <Link
                        href={{
                            query: {
                                ...router.query,
                                page: page + 1,
                            },
                        }}
                        scroll
                    >
                        <a
                            className="pagination-next"
                        >
                            Next
                        </a>
                    </Link>
                )}
            <ul className="pagination-list">
                {new Array(pages).fill({}).map((_, i) => {
                    const currentPage = page - 1
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <React.Fragment key={i}>
                            {currentPage - 1 === i && i > 1 && page - 2 !== pages
                                && <li><span className="pagination-ellipsis">&hellip;</span></li>}
                            {[0, currentPage - 1, currentPage, currentPage + 1, pages - 1].includes(i)
                                && (
                                    <li>
                                        <Link
                                            href={{
                                                query: {
                                                    ...router.query,
                                                    page: i + 1,
                                                },
                                            }}
                                            scroll
                                        >
                                            <a
                                                className={classNames('pagination-link', { 'is-current': currentPage === i })}
                                            >
                                                {i + 1}
                                            </a>
                                        </Link>
                                    </li>
                                )}
                            {currentPage + 1 === i && i < pages - 1 && page + 2 !== pages
                                && <li><span className="pagination-ellipsis">&hellip;</span></li>}
                        </React.Fragment>
                    )
                })}
            </ul>
        </nav>
    )
}
