'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import { DefaultThumbnail } from 'components/ui/default-thumbnail'
import LinkPendingOverlay from 'components/ui/link-pending-overlay'
import { buildImageUrl, createImageStatusUpdater } from 'lib/image/identity'
import { buildItemDetailUrl } from 'lib/projection/item'
import { getAlbumDisplay, getCategoryDisplay } from 'lib/display/taxonomy'
import type { Item } from 'lib/catalog/data'
import type { ImageStatus } from 'lib/image/identity'

/**
 * Renders an item card linking to the detail page
 * @returns An article element representing the item, with image, title, category icon and album link
 */
export default function ItemCard({
    item,
    priority = false,
}: {
    /** The item to be displayed */
    readonly item: Item
    /** Whether to eagerly load and preload the image (set only for the first/LCP card) */
    readonly priority?: boolean
}) {
    const router = useRouter()
    const [isHovered, setIsHovered] = useState(false)
    const [statusImages, setStatusImages] = useState<Record<string, ImageStatus>>({})
    const updateImageStatus = createImageStatusUpdater(setStatusImages)
    const albumDisplay = getAlbumDisplay(item.link)
    const categoryDisplay = getCategoryDisplay(item.category)

    return (
        <article className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col transition-colors duration-200">
            <Link
                href={buildItemDetailUrl('', item)}
                onMouseEnter={() => {
                    router.prefetch(buildItemDetailUrl('', item))
                }}
                prefetch={false}
                title={item.title}
            >
                <div
                    className="relative h-52 overflow-hidden bg-gray-900 border-b border-gray-800"
                    onMouseEnter={() => {
                        setIsHovered(true)
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false)
                    }}
                >
                    <DefaultThumbnail />
                    <LinkPendingOverlay />
                    {statusImages[item.imagesId[0]] !== 'error' && (
                        <>
                            <Image
                                alt={item.title}
                                className={classNames(
                                    'thumb-image absolute inset-0 object-contain transition-opacity duration-300 text-transparent',
                                    {
                                        'opacity-0':
                                            !statusImages[item.imagesId[0]] ||
                                            (isHovered && item.imagesId[1] && statusImages[item.imagesId[1]] !== 'error'),
                                        'opacity-100':
                                            statusImages[item.imagesId[0]] === 'resolved' &&
                                            !(isHovered && item.imagesId[1] && statusImages[item.imagesId[1]] !== 'error'),
                                    },
                                )}
                                draggable={false}
                                fill
                                onError={() => {
                                    updateImageStatus(item.imagesId[0], 'error')
                                }}
                                onLoad={() => {
                                    updateImageStatus(item.imagesId[0], 'resolved')
                                }}
                                priority={priority}
                                // eslint-disable-next-line max-len
                                sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) calc(33vw - 120px), 220px"
                                src={buildImageUrl({ folderId: item.folderId, imageId: item.imagesId[0] })}
                            />
                            {item.imagesId[1] && (
                                <Image
                                    alt={`${item.title} - alternate`}
                                    className={classNames(
                                        'absolute inset-0 object-contain transition-opacity duration-300 text-transparent',
                                        isHovered && statusImages[item.imagesId[0]] === 'resolved' ? 'opacity-100' : 'opacity-0',
                                    )}
                                    draggable={false}
                                    fill
                                    loading="lazy"
                                    onError={() => {
                                        updateImageStatus(item.imagesId[1], 'error')
                                    }}
                                    onLoad={() => {
                                        updateImageStatus(item.imagesId[1], 'resolved')
                                    }}
                                    // eslint-disable-next-line max-len
                                    sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) calc(33vw - 120px), 220px"
                                    src={buildImageUrl({ folderId: item.folderId, imageId: item.imagesId[1] })}
                                />
                            )}
                        </>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-3 flex-1">
                <h3>
                    <Link
                        className="text-sm font-semibold text-gray-100 hover:text-brand-400 transition-colors leading-snug line-clamp-2"
                        href={buildItemDetailUrl('', item)}
                        onMouseEnter={() => {
                            router.prefetch(buildItemDetailUrl('', item))
                        }}
                        prefetch={false}
                        title={item.title}
                    >
                        {item.title}
                    </Link>
                </h3>
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-gray-800 flex items-center gap-3 justify-between">
                {/* Category */}
                <span
                    className="flex items-center gap-1 text-xs text-gray-400"
                    title={item.category}
                >
                    {categoryDisplay.icon}
                    <span className="truncate max-w-[80px]">{categoryDisplay.label}</span>
                </span>

                {/* Album link */}
                <span
                    className="flex items-center gap-1 text-xs text-gray-400"
                    title={item.link}
                >
                    {albumDisplay.icon}
                    <span className="truncate max-w-[80px]">{albumDisplay.shortLabel || 'Unknown'}</span>
                </span>
            </div>
        </article>
    )
}
