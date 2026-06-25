'use client'

import classNames from 'classnames'

/**
 * Default placeholder thumbnail shown before actual image loads or if no image is available.
 * @returns JSX.Element
 */
export function DefaultThumbnail({
    size = 'normal',
}: {
    /**
     * Size of the thumbnail.
     * @default 'normal'
     */
    readonly size?: 'normal' | 'small'
}) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-900 to-gray-800">
            <svg
                className={classNames('w-8 h-8 text-gray-700', {
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
