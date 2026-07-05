import { GoogleAuth } from 'google-auth-library'
import type { JWTInput } from 'google-auth-library'

/** OAuth2 scope granting read-only access to the catalog Google Sheet. */
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly'

/** Memoized GoogleAuth client built from the service account credentials. */
let auth: GoogleAuth | null = null

/**
 * Build (once) a GoogleAuth client from the GOOGLE_API_JSON service account secret.
 * @returns Memoized GoogleAuth client scoped for Sheets read-only access.
 */
function getAuth(): GoogleAuth {
    if (auth) {
        return auth
    }

    const raw = process.env.GOOGLE_API_JSON
    if (!raw) {
        throw new Error('Missing GOOGLE_API_JSON service account credentials')
    }

    // Re-escape real newlines (dotenv expands \n in double-quoted .env values) so the JSON with an embedded PEM private_key still parses.
    const credentials = JSON.parse(raw.replace(/\n/g, '\\n').replace(/\r/g, '\\r')) as JWTInput
    auth = new GoogleAuth({ credentials, scopes: [SCOPE] })
    return auth
}

/**
 * Get an OAuth2 access token for the Google Sheets read-only scope.
 * The underlying token is cached and refreshed internally by google-auth-library.
 * @returns Bearer access token.
 */
export async function getGoogleAccessToken(): Promise<string> {
    const token = await getAuth().getAccessToken()
    if (!token) {
        throw new Error('Failed to obtain Google access token')
    }

    return token
}
