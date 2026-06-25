import Link from 'next/link'

/**
 * 404 - item or page not found
 * @returns The 404 not found page
 */
export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <div className="mb-6">
                <span className="text-8xl font-display font-black text-brand-500 tabular-nums select-none">404</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-100 mb-3">Page not found</h1>
            <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                The item or page you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Link
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors"
                href="/"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        // eslint-disable-next-line max-len
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                    />
                </svg>
                Return to archive
            </Link>
        </div>
    )
}
