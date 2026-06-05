import Image from 'next/image'
import CategoryIcon from 'components/ui/category-icon'
import albums from 'lib/display/albums'
import type { ReactNode } from 'react'

/** Display metadata for an album value. */
export interface AlbumDisplay {
    /** Album name from the closet catalog. */
    name: string
    /** Optional album cover path. */
    cover?: string
    /** Short label for compact UI. */
    shortLabel: string
    /** Icon node used next to the album label. */
    icon: ReactNode
}

/** Display metadata for a category value. */
export interface CategoryDisplay {
    /** Category name from the closet catalog. */
    name: string
    /** Safe label for missing values. */
    label: string
    /** Icon node used next to the category label. */
    icon: ReactNode
}

/**
 * Returns display metadata for an album.
 * @param name Album or linked release name.
 * @returns Album display metadata.
 */
export function getAlbumDisplay(name: string): AlbumDisplay {
    const cover = albums[name]
    return {
        name,
        cover,
        shortLabel: shortenAlbumName(name),
        icon: cover ? (
            <Image
                alt={name}
                className="rounded-sm object-cover text-transparent"
                decoding="async"
                height={16}
                loading="lazy"
                src={cover}
                width={16}
            />
        ) : (
            <svg
                className="w-4 h-4 text-stone-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                    strokeWidth={2}
                />
                <path
                    d="M12 3c-3 4-3 14 0 18M12 3c3 4 3 14 0 18M3 12h18"
                    strokeLinecap="round"
                    strokeWidth={2}
                />
            </svg>
        ),
    }
}

/**
 * Returns display metadata for a category.
 * @param name Category name.
 * @returns Category display metadata.
 */
export function getCategoryDisplay(name: string): CategoryDisplay {
    return {
        name,
        label: name || 'Unknown',
        icon: <CategoryIcon name={name} />,
    }
}

/**
 * Shortens a long album name to initials for compact display.
 * @param name Album name.
 * @returns Original or shortened album label.
 */
function shortenAlbumName(name: string): string {
    if (name.length <= 10 || name.split(' ').length <= 1) {
        return name
    }

    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
}
