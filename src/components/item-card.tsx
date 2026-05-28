'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames'
import CategoryIcon from 'components/category-icon'
import albums from 'lib/albums'
import type { Item } from 'lib/database'

/**
 * Default placeholder thumbnail shown before actual image loads or if no image is available.
 * @returns JSX.Element
 */
export function DefaultThumbnail({
    size = 'normal',
}: {
    /**
     * Size of the thumbnail
     * @default 'normal'
     */
    readonly size?: 'normal' | 'small'
}) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-900 to-stone-800">
            <svg
                className={classNames('w-8 h-8 text-stone-700', {
                    'scale-[1]': size === 'normal',
                    'scale-[0.5]': size === 'small',
                })}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    // eslint-disable-next-line max-len
                    d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                />
            </svg>
        </div>
    )
}

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
    const [statusImages, setStatusImages] = useState<Map<string, 'error' | 'resolved' | undefined>>(new Map())

    const albumCover = albums[item.link]

    const updateImageStatus = (imageId: string, status: 'error' | 'resolved' | undefined) => {
        setStatusImages(prev => new Map(prev).set(imageId, status))
    }

    const shortLink =
        item.link.length > 10 && item.link.split(' ').length > 1
            ? item.link
                  .split(' ')
                  .map(x => x.charAt(0))
                  .join('')
                  .toUpperCase()
            : item.link

    return (
        <article className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden flex flex-col transition-colors duration-200">
            <Link
                href={`/${item.folderId}`}
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
                    {statusImages.get(item.imagesId[0]) !== 'error' && (
                        <>
                            <Image
                                alt={item.title}
                                className={classNames('absolute inset-0 object-contain transition-opacity duration-300 text-transparent', {
                                    'opacity-0':
                                        !statusImages.get(item.imagesId[0]) ||
                                        (isHovered && item.imagesId[1] && statusImages.get(item.imagesId[1]) !== 'error'),
                                    'opacity-100':
                                        statusImages.get(item.imagesId[0]) === 'resolved' &&
                                        !(isHovered && item.imagesId[1] && statusImages.get(item.imagesId[1]) !== 'error'),
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
                                src={`/image/${item.folderId}/${item.imagesId[0]}`}
                            />
                            {item.imagesId[1] && (
                                <Image
                                    alt={`${item.title} - alternate`}
                                    className={classNames(
                                        'absolute inset-0 object-contain transition-opacity duration-300 text-transparent',
                                        isHovered ? 'opacity-100' : 'opacity-0',
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
                                    src={`/image/${item.folderId}/${item.imagesId[1]}`}
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
                    href={`/${item.folderId}`}
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
                    <CategoryIcon name={item.category} />
                    <span className="truncate max-w-[80px]">{item.category || 'Unknown'}</span>
                </span>

                {/* Album link */}
                <span
                    className="flex items-center gap-1 text-xs text-stone-400"
                    title={item.link}
                >
                    {albumCover ? (
                        <Image
                            alt={item.link}
                            className="rounded-sm object-cover"
                            decoding="async"
                            height={16}
                            loading="lazy"
                            src={albumCover}
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
                    )}
                    <span className="truncate max-w-[80px]">{shortLink || 'Unknown'}</span>
                </span>
            </div>
        </article>
    )
}
