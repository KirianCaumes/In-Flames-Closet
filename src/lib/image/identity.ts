const SAFE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/

/** Status tracked for rendered closet images. */
export type ImageStatus = 'error' | 'resolved' | undefined

/** Route identity for one closet image. */
export interface ClosetImageIdentity {
    /** Folder ID containing the image. */
    folderId: string
    /** Image ID or filename. */
    imageId: string
}

/**
 * Builds a closet image URL.
 * @param identity Closet image identity.
 * @returns Image URL for rendering or metadata.
 */
export function buildImageUrl(identity: ClosetImageIdentity): string {
    return `/image/${encodeURIComponent(identity.folderId)}/${encodeURIComponent(identity.imageId)}`
}

/**
 * Builds an absolute closet image URL.
 * @param siteUrl Site URL prefix.
 * @param identity Closet image identity.
 * @returns Absolute image URL.
 */
export function buildAbsoluteImageUrl(siteUrl: string, identity: ClosetImageIdentity): string {
    return `${siteUrl}${buildImageUrl(identity)}`
}

/**
 * Validates closet image identity values.
 * @param identity Closet image identity.
 * @returns Whether the identity is safe for local storage lookup.
 */
export function isValidImageIdentity(identity: ClosetImageIdentity): boolean {
    return SAFE_ID_PATTERN.test(identity.folderId) && SAFE_ID_PATTERN.test(identity.imageId)
}

/**
 * Creates an immutable image status updater.
 * @param setStatus React state setter for image statuses.
 * @returns Function that updates one image status.
 */
export function createImageStatusUpdater(setStatus: (updater: (prev: Record<string, ImageStatus>) => Record<string, ImageStatus>) => void) {
    return (imageKey: string, status: ImageStatus) => {
        setStatus(prev => ({ ...prev, [imageKey]: status }))
    }
}
