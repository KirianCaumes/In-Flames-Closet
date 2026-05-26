/**
 * Renders a small inline SVG icon that represents the given item category
 * @returns An SVG icon representing the category, or a default box icon if the category is unknown
 */
export default function CategoryIcon({
    name = 'Other',
}: {
    /** The category name */
    readonly name?: string
}) {
    switch (name) {
        case 'T-Shirt':
            return (
                // Shirt / T-shirt outline
                <svg
                    className="w-4 h-4 inline"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M3 7l4-3h10l4 3-3 3v9H6V10L3 7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9 4c0 1.657-1.343 3-3 3m9-3c0 1.657 1.343 3 3 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )
        case 'Sweater':
        case 'Long Sleeve':
            return (
                // Sweatshirt outline with long sleeves
                <svg
                    className="w-4 h-4 inline"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M2 8l4-4h12l4 4-3 2v10H5V10L2 8z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M10 4v3M14 4v3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )
        case 'Patch':
            return (
                // Shield / patch badge
                <svg
                    className="w-4 h-4 inline"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M12 3l8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6l8-3z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )
        case 'Trouser':
            return (
                // Pants outline
                <svg
                    className="w-4 h-4 inline"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M5 3h14v5l-2 13h-4l-1-7-1 7H7L5 8V3z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )
        case 'Cap':
            return (
                // Graduation / baseball cap
                <svg
                    className="w-4 h-4 inline"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M12 3L2 9l10 4 10-4-10-6z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M6 11v6a6 6 0 0012 0v-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )
        case 'Poster':
        case 'Concert Poster':
        case 'Magazine Poster':
            return (
                // Image / poster frame
                <svg
                    className="w-4 h-4 inline"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                >
                    <rect
                        height="16"
                        rx="2"
                        ry="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="18"
                        x="3"
                        y="3"
                    />
                    <path
                        d="M3 15l5-5 4 4 3-3 4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle
                        cx="8.5"
                        cy="8.5"
                        r="1.5"
                    />
                </svg>
            )
        case 'Photo':
            return (
                // Camera
                <svg
                    className="w-4 h-4 inline"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle
                        cx="12"
                        cy="13"
                        r="4"
                    />
                </svg>
            )
        case 'Pick':
            return (
                // Triangle / guitar pick
                <svg
                    className="w-4 h-4 inline"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 2L22 20H2L12 2z" />
                </svg>
            )
        default:
            return (
                // Box / package (default)
                <svg
                    className="w-4 h-4 inline"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 640 512"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* eslint-disable-next-line max-len */}
                    <path d="M425.7 256c-16.9 0-32.8-9-41.4-23.4L320 126l-64.2 106.6c-8.7 14.5-24.6 23.5-41.5 23.5-4.5 0-9-.6-13.3-1.9L64 215v178c0 14.7 10 27.5 24.2 31l216.2 54.1c10.2 2.5 20.9 2.5 31 0L551.8 424c14.2-3.6 24.2-16.4 24.2-31V215l-137 39.1c-4.3 1.3-8.8 1.9-13.3 1.9zm212.6-112.2L586.8 41c-3.1-6.2-9.8-9.8-16.7-8.9L320 64l91.7 152.1c3.8 6.3 11.4 9.3 18.5 7.3l197.9-56.5c9.9-2.9 14.7-13.9 10.2-23.1zM53.2 41L1.7 143.8c-4.6 9.2.3 20.2 10.1 23l197.9 56.5c7.1 2 14.7-1 18.5-7.3L320 64 69.8 32.1c-6.9-.8-13.5 2.7-16.6 8.9z" />
                </svg>
            )
    }
}
