import axios, { AxiosError } from 'axios'

const RANGE_DATA = 'Data!A1:I999'
const RANGE_PARAMS = 'Params!A1:D999'
const DEFAULT_OFFSET = 30

interface GoogleApiResponse {
    range: string;
    majorDimension: string;
    values: string[][];
}

export type Item = {
    folderId: string;
    imagesId: string[];
    title: string;
    category: string;
    link: string;
    year: string;
    source: string;
    official: string;
    comment: string;
}

export type ItemsResult = {
    items: Item[];
    total: number;
    pagesNumber: number;
    limit: number;
}

export type Params = {
    links: string[];
    years: string[];
    categories: string[];
}

export type Filters = {
    offset?: number;
    links: string[];
    years: string[];
    categories: string[];
    title: string;
    page: number;
    sort: ESort;
}

export enum ESort {
    NEW = 'new',
    OLD = 'old',
}

class Database {
    private items: Item[] = []

    private links: string[] = []

    private years: string[] = []

    private categories: string[] = []

    /**
     * Synchronize item with local
     */
    private async syncItem() {
        try {
            const result = await axios.request<GoogleApiResponse>({
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
            const result = await axios.request<GoogleApiResponse>({
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
        sort = ESort.NEW,
        title = '',
    }: Filters)
        : Promise<ItemsResult> {
        await this.applyItemSync()

        const itemsFiltered = this.items
            .filter(item => (
                (links?.length === 0 || links.includes(item.link))
                && (categories?.length === 0 || categories.includes(item.category))
                && (years?.length === 0 || years.includes(item.year))
                && (!title || item.title?.toLowerCase().includes(title.toLocaleLowerCase()))
            ))

        switch (sort) {
            case ESort.OLD:
                itemsFiltered.reverse()
                break
            case ESort.NEW:
            default:
                break
        }

        return {
            items: itemsFiltered.slice(offset * (page - 1), offset * page),
            total: itemsFiltered.length,
            pagesNumber: Math.ceil(itemsFiltered.length / offset),
            limit: offset,
        }
    }

    /**
     * Get a items by id
     */
    public async getById(id: string): Promise<Item | null> {
        await this.applyItemSync()

        return this.items.find(item => item.folderId === id) ?? null
    }

    /**
     * Get params
     */
    public async getParams(): Promise<Params> {
        await this.applyParamSync()

        return {
            links: this.links,
            years: this.years,
            categories: this.categories,
        }
    }
}

let databaseInstance: Database

export default function getDatabase() {
    if (!databaseInstance)
        databaseInstance = new Database()

    return databaseInstance
}
