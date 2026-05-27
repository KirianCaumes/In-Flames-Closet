'use client'

import classNames from 'classnames'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import CategoryIcon from 'components/category-icon'
import albums from 'lib/albums'
import type { Item } from 'lib/database'

interface ItemDetailProps {
    /** The item to display */
    readonly item: Item
}

/**
 * Item detail view - image carousel + metadata.
 * Share button is client-only (requires navigator.share).
 * @returns The rendered item detail page, with image carousel, metadata and share functionality
 */
export default function ItemDetail({ item }: ItemDetailProps) {
    const router = useRouter()
    const [activeIndex, setActiveIndex] = useState(0)
    const albumCover = albums[item.link]

    return (
        <div className="min-h-screen">
            {/* ── Header ─────────────────────────────────────────────── */}
            <header className="bg-stone-900/80 backdrop-blur-sm border-b border-stone-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
                    <button
                        aria-label="Back to archive"
                        // eslint-disable-next-line max-len
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                        onClick={() => {
                            router.back()
                        }}
                        type="button"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M15 19l-7-7 7-7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                            />
                        </svg>
                    </button>
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center gap-2 text-sm text-stone-400 min-w-0"
                    >
                        <Link
                            className="hover:text-brand-400 transition-colors"
                            href="/"
                        >
                            Home
                        </Link>
                        <svg
                            className="w-3.5 h-3.5 text-stone-600 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M9 5l7 7-7 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                            />
                        </svg>
                        <span className="truncate text-stone-200">{item.title || 'Unknown'}</span>
                    </nav>
                </div>
            </header>

            {/* ── Content ────────────────────────────────────────────── */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left - image carousel */}
                    <div className="w-full lg:w-1/2 space-y-3">
                        {/* Main image */}
                        <div className="relative bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden aspect-square">
                            {/* Main image */}
                            <Image
                                alt={item.title}
                                className="object-contain color-transparent"
                                fill
                                loading="eager"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                src={`/image/${item.folderId}/${item.imagesId[activeIndex]}`}
                            />

                            {/* Prev / next arrows */}
                            {item.imagesId.length > 1 && (
                                <>
                                    <button
                                        aria-label="Previous image"
                                        // eslint-disable-next-line max-len
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                                        onClick={() => {
                                            setActiveIndex(prev => (prev === 0 ? item.imagesId.length - 1 : prev - 1))
                                        }}
                                        type="button"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M15 19l-7-7 7-7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        aria-label="Next image"
                                        // eslint-disable-next-line max-len
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                                        onClick={() => {
                                            setActiveIndex(prev => (prev === item.imagesId.length - 1 ? 0 : prev + 1))
                                        }}
                                        type="button"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M9 5l7 7-7 7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                            />
                                        </svg>
                                    </button>

                                    {/* Dot indicators */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {item.imagesId.map((_, i) => (
                                            <button
                                                aria-label={`Image ${i + 1}`}
                                                className={classNames('w-2 h-2 rounded-full transition-colors cursor-pointer', {
                                                    'bg-brand-500': i === activeIndex,
                                                    'bg-stone-600': i !== activeIndex,
                                                    'hover:bg-stone-400': i !== activeIndex,
                                                })}
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={i}
                                                onClick={() => {
                                                    setActiveIndex(i)
                                                }}
                                                type="button"
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails strip */}
                        {item.imagesId.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {item.imagesId.map((imgId, i) => (
                                    <button
                                        className={classNames(
                                            'relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors cursor-pointer',
                                            {
                                                'border-brand-500': i === activeIndex,
                                                'border-stone-700': i !== activeIndex,
                                                'hover:border-stone-500': i !== activeIndex,
                                            },
                                        )}
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={i}
                                        onClick={() => {
                                            setActiveIndex(i)
                                        }}
                                        type="button"
                                    >
                                        <Image
                                            alt={`${item.title} - image ${i + 1}`}
                                            className="object-cover color-transparent"
                                            fill
                                            loading="lazy"
                                            sizes="64px"
                                            src={`/image/${item.folderId}/${imgId}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right - metadata */}
                    <div className="flex-1 space-y-5">
                        {/* Title + share */}
                        <div className="flex items-start gap-3">
                            <h1 className="text-2xl sm:text-3xl font-bold text-stone-100 leading-tight flex-1">
                                {item.title || 'Unknown'}
                            </h1>
                            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                            {typeof window !== 'undefined' && navigator.share && (
                                <button
                                    aria-label="Share"
                                    // eslint-disable-next-line max-len
                                    className="shrink-0 w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                                    onClick={async () => {
                                        try {
                                            await navigator.share({
                                                title: item.title,
                                                url: `/${item.folderId}`,
                                            })
                                        } catch {
                                            // Dismissed or unsupported - do nothing
                                        }
                                    }}
                                    type="button"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Metadata rows */}
                        <dl className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-800">
                            {[
                                {
                                    label: 'Category',
                                    value: item.category,
                                    icon: (
                                        <span className="text-stone-400">
                                            <CategoryIcon name={item.category} />
                                        </span>
                                    ),
                                    href: `/?categories=${encodeURIComponent(item.category)}`,
                                },
                                {
                                    label: 'Year',
                                    value: item.year,
                                    icon: null,
                                    href: `/?years=${encodeURIComponent(item.year)}`,
                                },
                                {
                                    label: 'Linked to',
                                    value: item.link,
                                    icon: albumCover ? (
                                        <Image
                                            alt={item.link}
                                            className="rounded-sm object-cover color-transparent"
                                            height={16}
                                            loading="lazy"
                                            src={albumCover}
                                            width={16}
                                        />
                                    ) : null,
                                    href: `/?links=${encodeURIComponent(item.link)}`,
                                },
                                { label: 'Official', value: item.official, icon: null, href: null },
                                { label: 'Source', value: item.source, icon: null, href: null },
                            ]
                                .filter(row => row.value)
                                .map(row => (
                                    <div
                                        className="flex items-center gap-3 px-4 py-3"
                                        key={row.label}
                                    >
                                        <dt className="text-xs font-semibold text-stone-500 uppercase tracking-wider w-24 shrink-0">
                                            {row.label}
                                        </dt>
                                        <dd className="flex items-center gap-2 text-sm text-stone-300 min-w-0">
                                            {row.icon}
                                            {row.href ? (
                                                <Link
                                                    className="hover:text-brand-400 transition-colors truncate"
                                                    href={row.href}
                                                    prefetch={false}
                                                >
                                                    {row.value}
                                                </Link>
                                            ) : (
                                                <span className="truncate">{row.value}</span>
                                            )}
                                        </dd>
                                    </div>
                                ))}
                        </dl>

                        {/* Comment */}
                        {item.comment && (
                            <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-4">
                                <p className="text-sm text-yellow-300 italic leading-relaxed">{item.comment}</p>
                            </div>
                        )}

                        {/* Report link */}
                        <a
                            className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-brand-400 transition-colors"
                            // eslint-disable-next-line max-len
                            href={`mailto:ajesterscollection@gmail.com?subject=${encodeURIComponent(`[In Flames Closet] Problem with ${item.title} (${item.folderId})`)}&body=${encodeURIComponent(`Hello,\nI think there is a problem with the item "${item.title}" (${item.folderId}):\n`)}`}
                        >
                            <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                />
                            </svg>
                            Report a problem with this item
                        </a>
                    </div>
                </div>
            </main>
        </div>
    )
}
