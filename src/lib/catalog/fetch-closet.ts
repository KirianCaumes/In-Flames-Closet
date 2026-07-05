import { getGoogleAccessToken } from 'lib/google/auth'
import { parseClosetFilters, parseClosetItems, type GoogleApiResponse, type Item, type Params } from 'lib/catalog/data'

const RANGE_DATA = 'Data!A1:I9999'
const RANGE_PARAMS = 'Params!A1:D9999'

/**
 * Fetch all closet items in newest-first order.
 * Server-only: pulls in google-auth-library, so it must never be imported by client components.
 * @returns Closet items.
 */
export async function fetchClosetItems(): Promise<Array<Item>> {
    const raw = await fetchCloset(RANGE_DATA)
    return parseClosetItems(raw).reverse()
}

/**
 * Fetch available closet query parameters.
 * Server-only: pulls in google-auth-library, so it must never be imported by client components.
 * @returns Available linked albums, years, and categories.
 */
export async function fetchClosetFilters(): Promise<Params> {
    const raw = await fetchCloset(RANGE_PARAMS)
    return parseClosetFilters(raw)
}

/**
 * Fetches one Google Sheets range using a service-account access token.
 * @param range Display range to fetch.
 * @returns Raw Google Sheets response.
 */
async function fetchCloset(range: string): Promise<GoogleApiResponse> {
    const sheetId = process.env.GOOGLE_SHEET_ID
    if (!sheetId) {
        throw new Error('Missing Google Sheets configuration')
    }

    const accessToken = await getGoogleAccessToken()

    const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`)

    const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: { revalidate: 3600 },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch Google Sheet range ${range}: HTTP ${response.status}`)
    }

    return (await response.json()) as GoogleApiResponse
}
