import React from 'react'
import classNames from 'classnames'

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
export default function Pagination({ page = 1, totalPages = 1, setPage }: {
    /** page */
    page: number
    /** totalPages */
    totalPages: number
    /** Set page */
    setPage: (newPage: number) => void
}) {
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
                    <a
                        onClick={() => setPage(page - 1)}
                        onKeyDown={() => setPage(page - 1)}
                        role="button"
                        tabIndex={0}
                        className="pagination-previous"
                    >
                        Previous
                    </a>
                )}
            {page >= totalPages
                ? (
                    <a
                        className="pagination-next"
                        disabled
                    >
                        Next
                    </a>
                )
                : (
                    <a
                        onClick={() => setPage(page + 1)}
                        onKeyDown={() => setPage(page + 1)}
                        role="button"
                        tabIndex={0}
                        className="pagination-next"
                    >
                        Next
                    </a>
                )}
            <ul className="pagination-list">
                {new Array(totalPages).fill({}).map((_, i) => {
                    const currentPage = page - 1
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <React.Fragment key={i}>
                            {currentPage - 1 === i && i > 1 && page - 2 !== totalPages
                                && <li><span className="pagination-ellipsis">&hellip;</span></li>}
                            {[0, currentPage - 1, currentPage, currentPage + 1, totalPages - 1].includes(i)
                                && (
                                    <li>
                                        <a
                                            onClick={() => setPage(i + 1)}
                                            onKeyDown={() => setPage(i + 1)}
                                            role="button"
                                            tabIndex={0}
                                            className={classNames('pagination-link', { 'is-current': currentPage === i })}
                                        >
                                            {i + 1}
                                        </a>
                                    </li>
                                )}
                            {currentPage + 1 === i && i < totalPages - 1 && page + 2 !== totalPages
                                && <li><span className="pagination-ellipsis">&hellip;</span></li>}
                        </React.Fragment>
                    )
                })}
            </ul>
        </nav>
    )
}
