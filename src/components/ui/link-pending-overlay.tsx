'use client'

import { useLinkStatus } from 'next/link'

/**
 * Overlay rendered over a Link's nearest positioned ancestor while that Link's navigation is pending.
 * Gives immediate feedback on slow networks, before the destination route has finished loading.
 * @returns A dimming spinner overlay while the navigation is pending, otherwise nothing.
 */
export default function LinkPendingOverlay() {
    const { pending: isPending } = useLinkStatus()

    if (!isPending) {
        return null
    }

    return (
        <span className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/60 backdrop-blur-[1px] animate-pending-in">
            <span className="block w-7 h-7 rounded-full border-2 border-gray-600 border-t-brand-500 animate-spin" />
        </span>
    )
}
