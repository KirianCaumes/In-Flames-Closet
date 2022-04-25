import React from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import Link from 'next/link'

declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        disabled?: boolean;
    }
}

/**
 * Pagination
 */
export default function Pagination({ current = 1, total = 1 }: { current: number; total: number }) {
    const router = useRouter()

    return (
        <nav
            className="pagination"
            role="navigation"
            aria-label="pagination"
        >
            {current <= 1
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
                                page: current - 1,
                            },
                        }}
                    >
                        <a
                            className="pagination-previous"
                        >
                            Previous
                        </a>
                    </Link>
                )}
            {current >= total
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
                                page: current + 1,
                            },
                        }}
                    >
                        <a
                            className="pagination-next"
                        >
                            Next
                        </a>
                    </Link>
                )}
            <ul className="pagination-list">
                {new Array(total).fill({}).map((_, i) => {
                    const currentPage = current - 1
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <React.Fragment key={i}>
                            {currentPage - 1 === i && i > 1 && current - 2 !== total
                                && <li><span className="pagination-ellipsis">&hellip;</span></li>}
                            {[0, currentPage - 1, currentPage, currentPage + 1, total - 1].includes(i)
                                && (
                                    <li>
                                        <Link
                                            href={{
                                                query: {
                                                    ...router.query,
                                                    page: i + 1,
                                                },
                                            }}
                                        >
                                            <a
                                                className={classNames('pagination-link', { 'is-current': currentPage === i })}
                                            >
                                                {i + 1}
                                            </a>
                                        </Link>
                                    </li>
                                )}
                            {currentPage + 1 === i && i < total - 1 && current + 2 !== total
                                && <li><span className="pagination-ellipsis">&hellip;</span></li>}
                        </React.Fragment>
                    )
                })}
            </ul>
        </nav>
    )
}
