import type { Item, Params } from 'lib/catalog/data'

/** Default number of closet items per page. */
export const DEFAULT_LIMIT = 60

/** Filter state used by the closet query module. */
export interface Filters {
    /** Starting item offset, kept for compatibility with older callers. */
    offset?: number
    /** Linked album filters. */
    links: Array<string>
    /** Year filters. */
    years: Array<string>
    /** Category filters. */
    categories: Array<string>
    /** Free-text title filter. */
    title: string
    /** Current one-based page. */
    page: number
    /** Sort order. */
    sort: 'new' | 'old'
}

/** Result returned after applying closet query behaviour. */
export interface ClosetQueryResult {
    /** Items visible on the selected page. */
    pagedItems: Array<Item>
    /** Total matching items. */
    total: number
    /** Total matching pages. */
    pages: number
}

/** Default closet query state. */
export const DEFAULT_FILTERS: Filters = { page: 1, links: [], years: [], categories: [], sort: 'new', title: '' }

/**
 * Parses URL search parameters into closet query filters.
 * @param params URL search parameters from the current location.
 * @returns Normalized closet query filters.
 */
export function filtersFromParams(params: URLSearchParams): Filters {
    const page = Number.parseInt(params.get('page') ?? '', 10)
    const sort = params.get('sort') === 'old' ? 'old' : 'new'

    return {
        page: Number.isNaN(page) || page < 1 ? 1 : page,
        links: params.getAll('links'),
        years: params.getAll('years'),
        categories: params.getAll('categories'),
        sort,
        title: params.get('title') ?? '',
    }
}

/**
 * Serializes closet query filters into URL search parameters.
 * @param filters Closet query filters.
 * @returns URL search parameters without a leading question mark.
 */
export function paramsFromFilters(filters: Filters): string {
    const params = new URLSearchParams()
    if (filters.page !== 1) {
        params.set('page', filters.page.toString())
    }
    if (filters.title) {
        params.set('title', filters.title)
    }
    if (filters.sort !== 'new') {
        params.set('sort', filters.sort)
    }
    filters.links.forEach(link => {
        params.append('links', link)
    })
    filters.years.forEach(year => {
        params.append('years', year)
    })
    filters.categories.forEach(category => {
        params.append('categories', category)
    })
    return params.toString()
}

/**
 * Builds a closet URL from a pathname and filters.
 * @param pathname Pathname to keep in the URL.
 * @param filters Closet query filters.
 * @returns URL string for the requested closet query.
 */
export function buildClosetUrl(pathname: string, filters: Filters): string {
    const qs = paramsFromFilters(filters)
    return qs ? `${pathname}?${qs}` : pathname
}

/**
 * Applies filter, sort, and pagination behaviour to closet items.
 * @param items All closet items.
 * @param filters Closet query filters.
 * @param limit Number of items per page.
 * @returns Paged closet query result.
 */
export function applyClosetQuery(items: Array<Item>, filters: Filters, limit = DEFAULT_LIMIT): ClosetQueryResult {
    const { links, categories, years, sort, title, page } = filters
    const normalizedTitle = title.toLowerCase()

    const filtered = items.filter(
        item =>
            (links.length === 0 || links.includes(item.link)) &&
            (categories.length === 0 || categories.includes(item.category)) &&
            (years.length === 0 || years.includes(item.year)) &&
            (!normalizedTitle || item.title.toLowerCase().includes(normalizedTitle)),
    )
    const sorted = sort === 'old' ? [...filtered].reverse() : filtered
    const total = sorted.length
    const pages = Math.ceil(total / limit)
    const safePage = Math.max(1, page)

    return {
        pagedItems: sorted.slice(limit * (safePage - 1), limit * safePage),
        total,
        pages,
    }
}

/**
 * Compares two closet query filter values.
 * @param left First filter value.
 * @param right Second filter value.
 * @returns Whether the filters are equal.
 */
export function areFiltersEqual(left: Filters, right: Filters): boolean {
    return (
        left.page === right.page &&
        left.title === right.title &&
        left.sort === right.sort &&
        sameList(left.links, right.links) &&
        sameList(left.years, right.years) &&
        sameList(left.categories, right.categories)
    )
}

/**
 * Indicates whether any user-visible filter is active.
 * @param filters Closet query filters.
 * @returns True when the query differs from the unfiltered state.
 */
export function hasActiveClosetFilters(filters: Filters): boolean {
    return (
        filters.page !== DEFAULT_FILTERS.page ||
        filters.title !== DEFAULT_FILTERS.title ||
        filters.links.length > 0 ||
        filters.years.length > 0 ||
        filters.categories.length > 0
    )
}

/**
 * Toggles one value inside a multi-select closet query filter.
 * @param values Existing selected values.
 * @param value Value to toggle.
 * @returns Updated selected values.
 */
export function toggleFilterValue(values: Array<string>, value: string): Array<string> {
    return values.includes(value) ? values.filter(current => current !== value) : [...values, value]
}

/**
 * Builds a filter URL for item detail metadata links.
 * @param key Filter key to set.
 * @param value Filter value.
 * @returns URL pointing at the filtered closet page.
 */
export function buildFilterUrl(key: keyof Pick<Params, 'links' | 'years' | 'categories'>, value: string): string {
    const params = new URLSearchParams()
    params.set(key, value)
    return `/?${params.toString()}`
}

/**
 * Builds the visible page list for pagination.
 * @param page Current one-based page.
 * @param pages Total page count.
 * @returns Page numbers with null entries for ellipses.
 */
export function getVisiblePages(page: number, pages: number): Array<number | null> {
    const pagesList: Array<number | null> = [1]
    if (page > 3) {
        pagesList.push(null)
    }
    Array.from(
        { length: Math.max(0, Math.min(pages - 1, page + 1) - Math.max(2, page - 1) + 1) },
        (_, index) => Math.max(2, page - 1) + index,
    ).forEach(visiblePage => {
        if (!pagesList.includes(visiblePage)) {
            pagesList.push(visiblePage)
        }
    })
    if (page < pages - 2) {
        pagesList.push(null)
    }
    if (!pagesList.includes(pages)) {
        pagesList.push(pages)
    }
    return pagesList
}

/**
 * Compares two ordered string lists.
 * @param left First list.
 * @param right Second list.
 * @returns Whether both lists contain the same values in the same order.
 */
function sameList(left: Array<string>, right: Array<string>): boolean {
    return left.length === right.length && left.every((value, index) => value === right[index])
}
