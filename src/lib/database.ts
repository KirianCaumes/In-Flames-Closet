const RANGE_DATA = 'Data!A1:I999'
const RANGE_PARAMS = 'Params!A1:D999'
const DEFAULT_OFFSET = 60

interface GoogleApiResponse {
    /** Range */
    range: string
    /** MajorDimension */
    majorDimension: string
    /** Values */
    values: Array<Array<string>>
}

export interface Item {
    /** FolderId */
    folderId: string
    /** ImagesId */
    imagesId: Array<string>
    /** Title */
    title: string
    /** Category */
    category: string
    /** Link */
    link: string
    /** Year */
    year: string
    /** Source */
    source: string
    /** Official */
    official: string
    /** Comment */
    comment: string
}

export interface ItemsResult {
    /** Paginated items for the current page */
    items: Array<Item>
    /** Total number of matching items */
    total: number
    /** Total number of all items */
    totalAll: number
    /** Total number of pages */
    pages: number
    /** Items per page */
    limit: number
}

export interface Params {
    /** Links */
    links: Array<string>
    /** Years */
    years: Array<string>
    /** Categories */
    categories: Array<string>
}

export interface Filters {
    /** Offset */
    offset?: number
    /** Links */
    links: Array<string>
    /** Years */
    years: Array<string>
    /** Categories */
    categories: Array<string>
    /** Title */
    title: string
    /** Page */
    page: number
    /** Sort */
    sort: 'new' | 'old'
}

/**
 * Database - thin wrapper that calls Google Sheets via fetch.
 * Caching and stale-while-revalidate are handled by Next.js data cache ({ next: { revalidate: 3600 } }).
 */
class Database {
    /**
     * Fetch and parse item rows from Google Sheets
     * @returns Array of parsed Item objects in reverse order (newest first)
     */
    private async fetchItems(): Promise<Array<Item>> {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID!}/values/${RANGE_DATA}`)
        url.searchParams.set('key', process.env.GOOGLE_API_KEY ?? '')

        const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
        const result = (await res.json()) as GoogleApiResponse

        return result.values
            .map(value => ({
                folderId: value[0] ?? '',
                imagesId: value[1]?.split(';') ?? [],
                title: value[2]?.trim() ?? '',
                category: value[3] ?? '',
                link: value[4] ?? '',
                year: value[5] ?? '',
                source: value[6]?.trim() ?? '',
                official: value[7] ?? '',
                comment: value[8]?.trim() ?? '',
            }))
            .filter((x, i) => x.folderId && i > 0)
            .reverse()
    }

    /**
     * Fetch and parse param rows (links/years/categories) from Google Sheets
     * @returns Deduplicated lists of available links, years and categories
     */
    private async fetchParams(): Promise<Params> {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID!}/values/${RANGE_PARAMS}`)
        url.searchParams.set('key', process.env.GOOGLE_API_KEY ?? '')

        const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
        const result = (await res.json()) as GoogleApiResponse

        const rows = result.values.map(value => ({
            category: value[0] ?? '',
            link: value[1] ?? '',
            year: value[2] ?? '',
        }))

        return {
            links: [...new Set(rows.map(x => x.link).filter(Boolean))],
            years: [...new Set(rows.map(x => x.year).filter(Boolean))],
            categories: [...new Set(rows.map(x => x.category).filter(Boolean))],
        }
    }

    /**
     * Get all items matching the given filters, paginated
     * @returns A paginated result of items matching the filters, along with total count and available pages
     */
    public async getAll({ offset = DEFAULT_OFFSET, page, links, categories, years, sort, title }: Filters): Promise<ItemsResult> {
        const items = await this.fetchItems()

        const itemsFiltered = items.filter(
            item =>
                (links.length === 0 || links.includes(item.link)) &&
                (categories.length === 0 || categories.includes(item.category)) &&
                (years.length === 0 || years.includes(item.year)) &&
                (!title || item.title.toLowerCase().includes(title.toLocaleLowerCase())),
        )

        if (sort === 'old') {
            itemsFiltered.reverse()
        }

        return {
            items: itemsFiltered.slice(offset * (page - 1), offset * page),
            total: itemsFiltered.length,
            totalAll: items.length,
            pages: Math.ceil(itemsFiltered.length / offset),
            limit: offset,
        }
    }

    /**
     * Get a single item by its folderId
     * @param id The folderId to look up
     * @returns The matching item, or null if not found
     */
    public async getById(id: string): Promise<Item | null> {
        const items = await this.fetchItems()
        return items.find(item => item.folderId === id) ?? null
    }

    /**
     * Get the full list of available filter options
     * @returns An object containing arrays of available links, years and categories for filtering
     */
    public async getParams(): Promise<Params> {
        return this.fetchParams()
    }
}

const database = new Database()

export default database
