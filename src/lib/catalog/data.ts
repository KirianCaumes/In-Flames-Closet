const RANGE_DATA = 'Data!A1:I9999'
const RANGE_PARAMS = 'Params!A1:D9999'

/** Raw Google Sheet response shape for the closet catalog. */
export interface GoogleApiResponse {
    /** Range returned by Google Sheets. */
    readonly range: string
    /** Major dimension returned by Google Sheets. */
    readonly majorDimension: string
    /** Row values returned by Google Sheets. */
    readonly values?: Array<Array<string>>
}

/** Raw closet item row keyed by Google Sheet headers. */
type RawItemRow = Partial<Record<string, string>>

/** Raw closet filter row keyed by Google Sheet headers. */
type RawFilterRow = Array<string>

/** Normalized closet filter values parsed from the sheet. */
interface ClosetFilterRow {
    /** Item category. */
    readonly category: string
    /** Linked album or release. */
    readonly link: string
    /** Item year. */
    readonly year: string
}

/** One archived In Flames artwork entry. */
export interface Item {
    /** Folder ID. */
    readonly folderId: string
    /** Image IDs. */
    readonly imagesId: Array<string>
    /** Item title. */
    readonly title: string
    /** Item category. */
    readonly category: string
    /** Linked album or release. */
    readonly link: string
    /** Item year. */
    readonly year: string
    /** Source text or URL. */
    readonly source: string
    /** Official status. */
    readonly official: string
    /** Editorial comment. */
    readonly comment: string
}

/** Available values for catalog filters. */
export interface Params {
    /** Linked albums or releases. */
    readonly links: Array<string>
    /** Years. */
    readonly years: Array<string>
    /** Categories. */
    readonly categories: Array<string>
}

/**
 * Fetch all closet items in newest-first order.
 * @returns Closet items.
 */
export async function fetchClosetItems(): Promise<Array<Item>> {
    const raw = await fetchCloset(RANGE_DATA)
    return parseClosetItems(raw).reverse()
}

/**
 * Fetch available closet query parameters.
 * @returns Available linked albums, years, and categories.
 */
export async function fetchClosetFilters(): Promise<Params> {
    const raw = await fetchCloset(RANGE_PARAMS)
    return parseClosetFilters(raw)
}

/**
 * Parse a Google Sheets response into normalized closet items.
 * @param raw Raw Google Sheets response.
 * @returns Normalized closet items.
 */
export function parseClosetItems(raw: GoogleApiResponse): Array<Item> {
    const rows = raw.values
    if (!rows || rows.length < 2) {
        return []
    }

    const headers = rows[0].map(header => header.trim())
    return rows
        .slice(1)
        .map(row => {
            const rawRow = Object.fromEntries(headers.map((header, rowIndex) => [header, (row[rowIndex] ?? '').trim()]))
            return normalizeItem(rawRow)
        })
        .filter(item => item.folderId)
}

/**
 * Parse a Google Sheets response into available closet filters.
 * @param raw Raw Google Sheets response.
 * @returns Available linked albums, years, and categories.
 */
export function parseClosetFilters(raw: GoogleApiResponse): Params {
    const rows = raw.values
    if (!rows) {
        return { links: [], years: [], categories: [] }
    }

    const parsedRows = rows.map(normalizeFilter)

    return {
        links: [...new Set(parsedRows.map(row => row.link).filter(Boolean))],
        years: [...new Set(parsedRows.map(row => row.year).filter(Boolean))],
        categories: [...new Set(parsedRows.map(row => row.category).filter(Boolean))],
    }
}

/**
 * Normalizes a raw Google Sheet row into a closet item.
 * @param row Raw row keyed by headers.
 * @returns Normalized closet item.
 */
function normalizeItem(row: RawItemRow): Item {
    return {
        folderId: row.FolderId ?? '',
        imagesId: (row.ImagesId ?? '')
            .split(';')
            .map(imageId => imageId.trim())
            .filter(Boolean),
        title: row.Title ?? '',
        category: row.Category ?? '',
        link: row['Linked to'] ?? '',
        year: row.Year ?? '',
        source: row.Source ?? '',
        official: row.Official ?? '',
        comment: row.Comment ?? '',
    }
}

/**
 * Normalizes a raw Google Sheet row into closet filter values.
 * @param row Raw row keyed by headers.
 * @returns Normalized closet filter values.
 */
function normalizeFilter(row: RawFilterRow): ClosetFilterRow {
    return {
        category: row[0] ?? '',
        link: row[1] ?? '',
        year: row[2] ?? '',
    }
}

/**
 * Fetches one Google Sheets range.
 * @param range Display range to fetch.
 * @returns Raw Google Sheets response.
 */
async function fetchCloset(range: string): Promise<GoogleApiResponse> {
    const sheetId = process.env.GOOGLE_SHEET_ID
    const apiKey = process.env.GOOGLE_API_KEY
    if (!sheetId || !apiKey) {
        throw new Error('Missing Google Sheets configuration')
    }

    const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`)
    url.searchParams.set('key', apiKey)

    const response = await fetch(url.toString(), { next: { revalidate: 3600 } })

    if (!response.ok) {
        throw new Error(`Failed to fetch Google Sheet range ${range}: HTTP ${response.status}`)
    }

    return (await response.json()) as GoogleApiResponse
}
