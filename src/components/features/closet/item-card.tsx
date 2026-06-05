'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames'
import { DefaultThumbnail } from 'components/ui/default-thumbnail'
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
}: {
    /** The item to be displayed */
    readonly item: Item
}) {
    const [isHovered, setIsHovered] = useState(false)
    const [statusImages, setStatusImages] = useState<Record<string, ImageStatus>>({})
    const updateImageStatus = createImageStatusUpdater(setStatusImages)
    const albumDisplay = getAlbumDisplay(item.link)
    const categoryDisplay = getCategoryDisplay(item.category)

    return (
        <article className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden flex flex-col transition-colors duration-200">
            <Link
                href={buildItemDetailUrl('', item)}
                title={item.title}
            >
                <div
                    className="relative h-52 overflow-hidden bg-stone-900 border-b border-stone-800"
                    onMouseEnter={() => {
                        setIsHovered(true)
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false)
                    }}
                >
                    <DefaultThumbnail />
                    {statusImages[item.imagesId[0]] !== 'error' && (
                        <>
                            <Image
                                alt={item.title}
                                className={classNames('absolute inset-0 object-contain transition-opacity duration-300 text-transparent', {
                                    'opacity-0':
                                        !statusImages[item.imagesId[0]] ||
                                        (isHovered && item.imagesId[1] && statusImages[item.imagesId[1]] !== 'error'),
                                    'opacity-100':
                                        statusImages[item.imagesId[0]] === 'resolved' &&
                                        !(isHovered && item.imagesId[1] && statusImages[item.imagesId[1]] !== 'error'),
                                })}
                                fill
                                loading="lazy"
                                onError={() => {
                                    updateImageStatus(item.imagesId[0], 'error')
                                }}
                                onLoad={() => {
                                    updateImageStatus(item.imagesId[0], 'resolved')
                                }}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                src={buildImageUrl({ folderId: item.folderId, imageId: item.imagesId[0] })}
                            />
                            {item.imagesId[1] && (
                                <Image
                                    alt={`${item.title} - alternate`}
                                    className={classNames(
                                        'absolute inset-0 object-contain transition-opacity duration-300 text-transparent',
                                        isHovered && statusImages[item.imagesId[0]] === 'resolved' ? 'opacity-100' : 'opacity-0',
                                    )}
                                    fill
                                    loading="lazy"
                                    onError={() => {
                                        updateImageStatus(item.imagesId[1], 'error')
                                    }}
                                    onLoad={() => {
                                        updateImageStatus(item.imagesId[1], 'resolved')
                                    }}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    src={buildImageUrl({ folderId: item.folderId, imageId: item.imagesId[1] })}
                                />
                            )}
                        </>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-3 flex-1">
                <Link
                    className="text-sm font-semibold text-stone-100 hover:text-brand-400 transition-colors leading-snug line-clamp-2"
                    href={buildItemDetailUrl('', item)}
                    title={item.title}
                >
                    {item.title}
                </Link>
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-stone-800 flex items-center gap-3 justify-between">
                {/* Category */}
                <span
                    className="flex items-center gap-1 text-xs text-stone-400"
                    title={item.category}
                >
                    {categoryDisplay.icon}
                    <span className="truncate max-w-[80px]">{categoryDisplay.label}</span>
                </span>

                {/* Album link */}
                <span
                    className="flex items-center gap-1 text-xs text-stone-400"
                    title={item.link}
                >
                    {albumDisplay.icon}
                    <span className="truncate max-w-[80px]">{albumDisplay.shortLabel || 'Unknown'}</span>
                </span>
            </div>
        </article>
    )
}
