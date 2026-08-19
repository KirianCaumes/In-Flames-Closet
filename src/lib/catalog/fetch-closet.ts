import { unstable_cache as unstableCache } from 'next/cache'
import { getGoogleAccessToken } from 'lib/google/auth'
import { parseClosetFilters, parseClosetItems, type GoogleApiResponse, type Item, type Params } from 'lib/catalog/data'

const RANGE_DATA = 'Data!A1:I9999'
const RANGE_PARAMS = 'Params!A1:D9999'

/** Cache lifetime, in seconds, of the raw Google Sheet payloads. */
const REVALIDATE = 3600

/** Cache tag allowing on-demand invalidation through `revalidateTag`. */
const CACHE_TAG = 'closet-sheet'

/**
 * Fetch all closet items in newest-first order.
 * Server-only: pulls in google-auth-library, so it must never be imported by client components.
 * @returns Closet items.
 */
export async function fetchClosetItems(): Promise<Array<Item>> {
    // Parsing stays outside the cache: unstable_cache stores JSON, so only the raw sheet payload is worth keeping in it.
    return parseClosetItems(await getCachedSheetValues(RANGE_DATA)).reverse()
}

/**
 * Fetch available closet query parameters.
 * Server-only: pulls in google-auth-library, so it must never be imported by client components.
 * @returns Available linked albums, years, and categories.
 */
export async function fetchClosetFilters(): Promise<Params> {
    return parseClosetFilters(await getCachedSheetValues(RANGE_PARAMS))
}

/**
 * Fetches one Google Sheets range using a service-account access token, uncached.
 * The Bearer token rotates hourly and takes part in the fetch cache key, so caching is done one level up by range only.
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
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch Google Sheet range ${range}: HTTP ${response.status}`)
    }

    return (await response.json()) as GoogleApiResponse
}

/**
 * Sheet payloads cached for an hour, keyed by range only.
 * Once stale, the cached value is still served while a background refresh runs, so no visitor ever waits on Google Sheets.
 */
const getCachedSheetValues = unstableCache(fetchCloset, [CACHE_TAG], { revalidate: REVALIDATE, tags: [CACHE_TAG] })
