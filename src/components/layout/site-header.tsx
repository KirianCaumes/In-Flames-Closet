import Image from 'next/image'
import Link from 'next/link'
// eslint-disable-next-line no-restricted-imports
import IconSvg from '../../../public/favicon.svg'

/**
 * Site chrome shared by every page: the signature and the switcher to the sibling In Flames Bootlegs site.
 * @returns The rendered site header.
 */
export default function SiteHeader() {
    return (
        <header className="border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-x-7 gap-y-3">
                <Link
                    className="inline-flex items-center gap-2.5 min-h-11"
                    href="/"
                >
                    <Image
                        alt=""
                        className="size-9 shrink-0"
                        height={36}
                        loading="eager"
                        src={IconSvg as string}
                        width={36}
                    />
                    <span className="font-display font-semibold text-[21px] text-gray-100">
                        In Flames <span className="text-brand-500">Closet</span>
                    </span>
                </Link>
                <div className="grow" />
                <nav
                    aria-label="In Flames archives"
                    className="flex border border-gray-800 rounded-lg overflow-hidden text-sm"
                >
                    <Link
                        aria-current="page"
                        className="inline-flex items-center gap-2 min-h-11 px-3.5 bg-gray-800 text-gray-100 font-medium"
                        href="/"
                    >
                        <span className="size-2 rounded-full bg-brand-500" />
                        Closet
                    </Link>
                    <a
                        className="inline-flex items-center gap-2 min-h-11 px-3.5 text-gray-400 hover:text-gray-100 transition-colors"
                        href="https://in-flames-bootlegs.kiriancaumes.fr"
                    >
                        <span className="size-2 rounded-full bg-[#e6443d]" />
                        Bootlegs
                    </a>
                </nav>
            </div>
        </header>
    )
}
