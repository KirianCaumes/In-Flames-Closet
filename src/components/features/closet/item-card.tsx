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
import { getCategoryDisplay } from 'lib/display/taxonomy'
import type { Item } from 'lib/catalog/data'
import type { ImageStatus } from 'lib/image/identity'

/**
 * Renders an item card linking to the detail page
 * @returns An article element representing the item, with image, title and category
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
    const categoryDisplay = getCategoryDisplay(item.category)

    return (
        <article className="flex flex-col gap-1 min-w-0">
            <Link
                href={buildItemDetailUrl('', item)}
                onMouseEnter={() => {
                    router.prefetch(buildItemDetailUrl('', item))
                }}
                prefetch={false}
                title={item.title}
            >
                <div
                    className="relative aspect-square mb-1.5 overflow-hidden border border-gray-800 rounded-lg"
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
                                    'thumb-image absolute inset-0 object-contain bg-black transition-opacity duration-300 text-transparent',
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
                                sizes="(max-width: 447px) 100vw, (max-width: 663px) 50vw, (max-width: 879px) 33vw, 260px"
                                src={buildImageUrl({ folderId: item.folderId, imageId: item.imagesId[0] })}
                            />
                            {item.imagesId[1] && (
                                <Image
                                    alt={`${item.title} - alternate`}
                                    className={classNames(
                                        'absolute inset-0 object-contain bg-black transition-opacity duration-300 text-transparent',
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
                                    sizes="(max-width: 447px) 100vw, (max-width: 663px) 50vw, (max-width: 879px) 33vw, 260px"
                                    src={buildImageUrl({ folderId: item.folderId, imageId: item.imagesId[1] })}
                                />
                            )}
                        </>
                    )}
                </div>
            </Link>

            <h3>
                <Link
                    className="text-sm font-semibold text-gray-100 hover:text-white transition-colors leading-[1.35] line-clamp-2"
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
            <p className="text-xs text-gray-400 truncate">{categoryDisplay.label}</p>
        </article>
    )
}
