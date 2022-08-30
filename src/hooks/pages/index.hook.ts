import { NextRouter, useRouter } from 'next/router'
import { ParsedUrlQueryInput } from 'querystring'
import {
    useEffect, useRef, useState,
} from 'react'

export const ARRAY_SEPARATOR = ' - '

export const DEFAULT_FILTERS = {
    sort: 'new' as 'new' | 'old',
    title: '',
    links: [] as string[],
    years: [] as string[],
    categories: [] as string[],
    page: 1,
}

export const DEFAULT_DETAILS = {
    links: true,
    years: false,
    categories: false,
}

export type FiltersType = typeof DEFAULT_FILTERS
export type DetailsType = typeof DEFAULT_DETAILS

export type UseIndexReturns = {
    /** IsDetailsOpen */
    isDetailsOpen: DetailsType
    /** SetIsDetailsOpen */
    setIsDetailsOpen: React.Dispatch<React.SetStateAction<DetailsType>>
    /** Filters */
    filters: FiltersType
    /** SetFilters */
    setFilters: React.Dispatch<React.SetStateAction<FiltersType>>
    /** TitleTimeoutRef */
    titleTimeoutRef: React.MutableRefObject<NodeJS.Timeout>
    /** Router */
    router: NextRouter
}

/**
 * Use index
 */
export default function useIndex(): UseIndexReturns {
    const router = useRouter()

    const [isDetailsOpen, setIsDetailsOpen] = useState(DEFAULT_DETAILS)

    const [filters, setFilters] = useState<FiltersType>({
        sort: 'new' as 'new' | 'old',
        title: router.query.title as string || '',
        links: (router.query.links as string)?.split(ARRAY_SEPARATOR).filter(x => x) ?? [],
        years: (router.query.years as string)?.split(ARRAY_SEPARATOR).filter(x => x) ?? [],
        categories: (router.query.categories as string)?.split(ARRAY_SEPARATOR).filter(x => x) ?? [],
        page: router.query.page ? +router.query.page : 1,
    })

    const titleTimeoutRef = useRef<NodeJS.Timeout>(0 as never)

    useEffect(() => {
        const query: ParsedUrlQueryInput = {
            ...router.query,
            page: filters.page,
            sort: filters.sort,
            title: filters.title,
            links: filters.links.join(ARRAY_SEPARATOR),
            years: filters.years.join(ARRAY_SEPARATOR),
            categories: filters.categories.join(ARRAY_SEPARATOR),
        }
        if (!query.page || query.page === 1)
            delete query.page
        if (!query.sort || query.sort === 'new')
            delete query.sort
        if (!query.title)
            delete query.title
        if (!query.links)
            delete query.links
        if (!query.years)
            delete query.years
        if (!query.categories)
            delete query.categories
        router.push({ pathname: '/', query }, undefined, { scroll: false })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters])

    return {
        isDetailsOpen,
        setIsDetailsOpen,
        filters,
        setFilters,
        titleTimeoutRef,
        router,
    }
}
