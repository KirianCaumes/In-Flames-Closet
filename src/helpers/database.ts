import axios, { AxiosError } from 'axios'

const RANGE_DATA = 'Data!A1:I999'
const RANGE_PARAMS = 'Params!A1:D999'
const DEFAULT_OFFSET = 30

type GoogleApiResponseType = {
    /** Range */
    range: string
    /** MajorDimension */
    majorDimension: string
    /** Values */
    values: string[][]
}

export type ItemType = {
    /** FolderId */
    folderId: string
    /** ImagesId */
    imagesId: string[]
    /** Title */
    title: string
    /** Category */
    category: string
    /** Link */
    link: string
    /** Year */
    year: string
    /** Source */
    source: string
    /** Official */
    official: string
    /** Comment */
    comment: string
}

export type ItemsResultType = {
    /** Items */
    items: ItemType[]
    /** Total */
    total: number
    /** TotalPages */
    pages: number
    /** Limit */
    limit: number
}

export type ParamsType = {
    /** Links */
    links: string[]
    /** Years */
    years: string[]
    /** Categories */
    categories: string[]
}

export type FiltersType = {
    /** Offset */
    offset?: number
    /** Links */
    links: string[]
    /** Years */
    years: string[]
    /** Categories */
    categories: string[]
    /** Title */
    title: string
    /** Page */
    page: number
    /** Sort */
    sort: 'new' | 'old'
}

/**
 * Database
 */
class Database {
    private items: ItemType[] = []

    private links: string[] = []

    private years: string[] = []

    private categories: string[] = []

    /**
     * Synchronize item with local
     */
    private async syncItem() {
        try {
            const result = await axios.request<GoogleApiResponseType>({
                method: 'GET',
                url: `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/${RANGE_DATA}`,
                params: {
                    key: process.env.GOOGLE_API_KEY,
                },
            })

            this.items = result.data?.values
                ?.map(value => ({
                    folderId: value[0] || '',
                    imagesId: value[1]?.split(';') ?? [],
                    title: value[2]?.trim() || '',
                    category: value[3] || '',
                    link: value[4] || '',
                    year: value[5] || '',
                    source: value[6]?.trim() || '',
                    official: value[7] || '',
                    comment: value[8]?.trim() || '',
                }))
                ?.filter((x, i) => x.folderId && i > 0)
                ?.reverse()
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error((error as AxiosError).message)
        }
    }

    /**
     * Synchronize params with local
     */
    private async syncParams() {
        try {
            const result = await axios.request<GoogleApiResponseType>({
                method: 'GET',
                url: `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/${RANGE_PARAMS}`,
                params: {
                    key: process.env.GOOGLE_API_KEY,
                },
            })

            const params = result.data?.values
                ?.map(value => ({
                    category: value[0] || '',
                    link: value[1] || '',
                    year: value[2] || '',
                }))

            this.links = params.map(x => x.link).filter((value, index, self) => value && self.indexOf(value) === index)
            this.years = params.map(x => x.year).filter((value, index, self) => value && self.indexOf(value) === index)
            this.categories = params.map(x => x.category).filter((value, index, self) => value && self.indexOf(value) === index)
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error((error as AxiosError).message)
        }
    }

    /**
     * Apply a item synchronization
     */
    private async applyItemSync() {
        if (!this.items?.length)
            await this.syncItem()
        else
            this.syncItem()
    }

    /**
     * Apply a param synchronization
     */
    private async applyParamSync() {
        if (!this.links?.length || !this.years?.length || !this.categories?.length)
            await this.syncParams()
        else
            this.syncParams()
    }

    /**
     * Get all items by filters
     */
    public async getAll({
        offset = DEFAULT_OFFSET,
        page = 1,
        links = [],
        categories = [],
        years = [],
        sort = 'new',
        title = '',
    }: FiltersType): Promise<ItemsResultType> {
        await this.applyItemSync()

        const itemsFiltered = this.items
            .filter(item => (
                (links?.length === 0 || links.includes(item.link))
                && (categories?.length === 0 || categories.includes(item.category))
                && (years?.length === 0 || years.includes(item.year))
                && (!title || item.title?.toLowerCase().includes(title.toLocaleLowerCase()))
            ))

        switch (sort) {
            case 'old':
                itemsFiltered.reverse()
                break
            case 'new':
            default:
                break
        }

        return {
            items: itemsFiltered.slice(offset * (page - 1), offset * page),
            total: itemsFiltered.length,
            pages: Math.ceil(itemsFiltered.length / offset),
            limit: offset,
        }
    }

    /**
     * Get a items by id
     * @param id Id
     */
    public async getById(id: string): Promise<ItemType | null> {
        await this.applyItemSync()

        return this.items.find(item => item.folderId === id) ?? null
    }

    /**
     * Get params
     */
    public async getParams(): Promise<ParamsType> {
        await this.applyParamSync()

        return {
            links: this.links,
            years: this.years,
            categories: this.categories,
        }
    }
}

let databaseInstance: Database

/**
 * Get database
 */
export default function getDatabase() {
    if (!databaseInstance)
        databaseInstance = new Database()

    return databaseInstance
}
