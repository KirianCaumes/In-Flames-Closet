/**
 * Loading skeleton shown while an item detail page is being fetched.
 * Renders immediately on navigation so slow networks get instant visual structure.
 * @returns The detail-page loading skeleton.
 */
export default function Loading() {
    return (
        <div className="min-h-screen">
            {/* ── Header ─────────────────────────────────────────────── */}
            <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-800 shrink-0" />
                    <nav className="flex items-center gap-2 text-sm text-gray-400 min-w-0">
                        <span>Home</span>
                        <svg
                            className="w-3.5 h-3.5 text-gray-600 shrink-0"
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
                        <span className="inline-block h-[0.7em] w-32 max-w-[40vw] rounded bg-gray-800 align-middle animate-pulse" />
                    </nav>
                </div>
            </header>

            {/* ── Content ────────────────────────────────────────────── */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left - image + thumbnails */}
                    <div className="w-full lg:w-1/2 space-y-3">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl aspect-square animate-pulse" />
                        <div className="flex gap-2">
                            {[0, 1, 2, 3].map(thumb => (
                                <div
                                    className="w-16 h-16 rounded-xl bg-gray-800 shrink-0 animate-pulse"
                                    key={thumb}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right - metadata */}
                    <div className="flex-1 space-y-5">
                        <div className="text-2xl sm:text-3xl leading-tight">
                            <span className="inline-block h-[0.7em] w-3/4 rounded-lg bg-gray-800 align-middle animate-pulse" />
                        </div>
                        <dl className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
                            {['Category', 'Year', 'Linked to', 'Official', 'Source'].map(label => (
                                <div
                                    className="flex items-center gap-3 px-4 py-3"
                                    key={label}
                                >
                                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 shrink-0">{label}</dt>
                                    <dd className="text-sm">
                                        <span className="inline-block h-[0.7em] w-32 max-w-full rounded bg-gray-800 align-middle animate-pulse" />
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </main>
        </div>
    )
}
