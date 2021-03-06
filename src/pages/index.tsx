import React, {
    useEffect,
    useMemo, useRef, useState,
} from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import getDatabase, {
    ESort, Params, ItemsResult,
} from 'helpers/database'
import {
    Card, Columns, Container, Heading, Media, Form, Button, Section, Breadcrumb, Icon,
} from 'react-bulma-components'
import styles from 'styles/pages/index.module.scss'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { AiFillHome } from 'react-icons/ai'
import { ParsedUrlQueryInput } from 'querystring'
import Pagination from 'components/pagination'
import { GrPowerReset } from 'react-icons/gr'
import CategoryIcon from 'components/categoryIcon'

const ARRAY_SEPARATOR = ' - '

const Index: NextPage<ItemsResult & { params: Params; currPage: number; }> = function Index({
    items, pagesNumber, currPage, params, total, limit,
}) {
    const router = useRouter()

    const [isLinksOpen, setIsLinksOpen] = useState(true)
    const [isYearsOpen, setIsYearsOpen] = useState(false)
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

    const [title, setTitle] = useState((router.query.title as string) || '')

    const selectedLinks = useMemo(() => (router.query.links as string)?.split(ARRAY_SEPARATOR).filter(x => x) ?? [], [router.query.links])
    const selectedYears = useMemo(() => (router.query.years as string)?.split(ARRAY_SEPARATOR).filter(x => x) ?? [], [router.query.years])
    const selectedCategories = useMemo(() => (router.query.categories as string)?.split(ARRAY_SEPARATOR).filter(x => x) ?? [], [router.query.categories])

    const titleTimeoutRef = useRef<NodeJS.Timeout>(0 as any)

    // Update title in query when title state change, delayed with a debounce function
    useEffect(() => {
        clearTimeout(titleTimeoutRef.current)
        titleTimeoutRef.current = setTimeout(() => {
            const query: ParsedUrlQueryInput = {
                ...router.query,
                page: 1,
                title,
            }
            if (!title)
                delete query.title
            router.push({ pathname: '/', query }, undefined, { scroll: false })
        }, 250)
    }, [title]) // eslint-disable-line react-hooks/exhaustive-deps

    // Update title when query change, only used for navigation back
    useEffect(() => {
        if ((router.query.title as string) !== title)
            setTitle(router.query.title as string || '')
    }, [router.query.title]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Head>
                <title>In Flames Closet - The history of In Flames through their artworks: clothes, goodies, and more!</title>
                <meta
                    name="description"
                    content="In Flames Closet - The history of In Flames through their artworks: clothes, goodies, and more!"
                />
            </Head>
            <Section className={styles.index}>
                <Container>
                    <Columns className={styles.columns}>
                        <Columns.Column
                            size="one-fifth"
                            className={styles['left-column']}
                        >
                            <Breadcrumb>
                                <Breadcrumb.Item active>
                                    <Link href="/">
                                        <a>
                                            <Icon>
                                                <AiFillHome />
                                            </Icon>
                                            <span>Home</span>
                                        </a>
                                    </Link>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </Columns.Column>
                        <Columns.Column
                            size="four-fifths"
                            className={styles['right-column']}
                        >
                            <div className={styles['right-column-top']}>
                                <div className={styles['right-column-top-left']}>
                                    <span>
                                        {limit > total ? total : limit}
                                        {' '}
                                        of
                                        {' '}
                                        {total || 0}
                                        {' '}
                                        result(s) found
                                    </span>
                                </div>
                                <div className={styles['right-column-top-right']}>
                                    <span>
                                        Sort by:
                                        {' '}
                                    </span>
                                    <Form.Select
                                        onChange={ev => router.push({
                                            pathname: '/',
                                            query: {
                                                ...router.query,
                                                page: 1,
                                                sort: ev.target.selectedOptions[0]?.value,
                                            },
                                        }, undefined, { scroll: false })}
                                        size="small"
                                    >
                                        <option value="new">
                                            Newly added
                                        </option>
                                        <option value="old">
                                            Formerly added
                                        </option>
                                    </Form.Select>
                                </div>
                            </div>
                        </Columns.Column>
                    </Columns>
                    <Columns className={styles.columns}>
                        <Columns.Column
                            size="one-fifth"
                            className={styles['left-column']}
                        >
                            <Form.Field>
                                <Form.Label>
                                    Title
                                </Form.Label>
                                <Form.Control>
                                    <Form.Input
                                        placeholder="Title"
                                        value={title}
                                        type="search"
                                        size="small"
                                        onChange={ev => setTitle(ev.target.value)}
                                    />
                                </Form.Control>
                            </Form.Field>
                            <details
                                open={isLinksOpen}
                            >
                                <summary
                                    onClick={ev => {
                                        ev.preventDefault()
                                        setIsLinksOpen(!isLinksOpen)
                                        setIsYearsOpen(false)
                                        setIsCategoriesOpen(false)
                                    }}
                                    className="label"
                                >
                                    Linked to:
                                </summary>
                                <Form.Field>
                                    {params.links.map(link => (
                                        <Form.Control key={link}>
                                            <Form.Checkbox
                                                checked={selectedLinks.includes(link)}
                                                onChange={ev => {
                                                    const query: ParsedUrlQueryInput = {
                                                        ...router.query,
                                                        page: 1,
                                                        links: ev.target.checked
                                                            ? [...selectedLinks, link].join(ARRAY_SEPARATOR)
                                                            : selectedLinks.filter(x => x !== link).join(ARRAY_SEPARATOR),
                                                    }
                                                    if (!(query.links as string[])?.length)
                                                        delete query.links
                                                    router.push({ pathname: '/', query }, undefined, { scroll: false })
                                                }}
                                            >
                                                {link}
                                            </Form.Checkbox>
                                        </Form.Control>
                                    ))}
                                </Form.Field>
                            </details>
                            <details
                                open={isYearsOpen}
                            >
                                <summary
                                    onClick={ev => {
                                        ev.preventDefault()
                                        setIsLinksOpen(false)
                                        setIsYearsOpen(!isYearsOpen)
                                        setIsCategoriesOpen(false)
                                    }}
                                    className="label"
                                >
                                    Years:
                                </summary>
                                <Form.Field>
                                    {params.years.map(year => (
                                        <Form.Control key={year}>
                                            <Form.Checkbox
                                                checked={selectedYears.includes(year)}
                                                onChange={ev => {
                                                    const query: ParsedUrlQueryInput = {
                                                        ...router.query,
                                                        page: 1,
                                                        years: ev.target.checked
                                                            ? [...selectedYears, year].join(ARRAY_SEPARATOR)
                                                            : selectedYears.filter(x => x !== year).join(ARRAY_SEPARATOR),
                                                    }
                                                    if (!(query.years as string[])?.length)
                                                        delete query.years
                                                    router.push({ pathname: '/', query }, undefined, { scroll: false })
                                                }}
                                            >
                                                {year}
                                            </Form.Checkbox>
                                        </Form.Control>
                                    ))}
                                </Form.Field>
                            </details>
                            <details
                                open={isCategoriesOpen}
                            >
                                <summary
                                    onClick={ev => {
                                        ev.preventDefault()
                                        setIsLinksOpen(false)
                                        setIsYearsOpen(false)
                                        setIsCategoriesOpen(!isCategoriesOpen)
                                    }}
                                    className="label"
                                >
                                    Categories:
                                </summary>
                                <Form.Field>
                                    {params.categories.map(category => (
                                        <Form.Control key={category}>
                                            <Form.Checkbox
                                                checked={selectedCategories.includes(category)}
                                                onChange={ev => {
                                                    const query: ParsedUrlQueryInput = {
                                                        ...router.query,
                                                        page: 1,
                                                        categories: ev.target.checked
                                                            ? [...selectedCategories, category].join(ARRAY_SEPARATOR)
                                                            : selectedCategories.filter(x => x !== category).join(ARRAY_SEPARATOR),
                                                    }
                                                    if (!(query.categories as string[])?.length)
                                                        delete query.categories
                                                    router.push({ pathname: '/', query }, undefined, { scroll: false })
                                                }}
                                            >
                                                <span>
                                                    {category}
                                                </span>
                                                <Icon>
                                                    <CategoryIcon name={category} />
                                                </Icon>
                                            </Form.Checkbox>
                                        </Form.Control>
                                    ))}
                                </Form.Field>
                            </details>
                            <Button
                                className={styles['left-column-button-reset']}
                                onClick={() => {
                                    router.push({
                                        pathname: '/',
                                        query: {},
                                    })
                                    setIsLinksOpen(true)
                                    setIsYearsOpen(false)
                                    setIsCategoriesOpen(false)
                                }}
                                size="small"
                                color="dark"
                            >
                                <Icon>
                                    <GrPowerReset />
                                </Icon>
                                <span>Reset filters</span>
                            </Button>
                        </Columns.Column>
                        <Columns.Column
                            size="four-fifths"
                            className={styles['right-column']}
                        >
                            <div
                                className={styles.cards}
                            >
                                {items.map(item => (
                                    <Card
                                        key={item.folderId}
                                        className={styles.card}
                                        renderAs="article"
                                    >
                                        <Link
                                            href={`/${item.folderId}`}
                                        >
                                            <a title={item?.title}>
                                                <div className="card-image">
                                                    <figure className={styles['card-image-container']}>
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={`/image/${item.folderId}/${item?.imagesId[0]}`}
                                                            alt={item.title}
                                                            decoding="async"
                                                            loading="lazy"
                                                        />
                                                    </figure>
                                                </div>
                                            </a>
                                        </Link>
                                        <Card.Content>
                                            <Media>
                                                <Media.Item>
                                                    <Heading
                                                        size={6}
                                                        renderAs="h2"
                                                        title={item?.title}
                                                    >
                                                        <Link
                                                            href={`/${item.folderId}`}
                                                        >
                                                            <a>
                                                                {item.title}
                                                            </a>
                                                        </Link>
                                                    </Heading>
                                                    <Heading
                                                        subtitle
                                                        size={6}
                                                        renderAs="h3"
                                                    >
                                                        <span>
                                                            <CategoryIcon name={item?.category} />
                                                        </span>
                                                        <span>{item?.category || 'Unknown'}</span>
                                                    </Heading>
                                                </Media.Item>
                                            </Media>
                                        </Card.Content>
                                    </Card>
                                ))}
                            </div>
                            <br />
                            <Pagination
                                current={currPage}
                                total={pagesNumber}
                            />
                        </Columns.Column>
                    </Columns>
                </Container>
            </Section>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async context => {
    const {
        page, links, years, categories, sort, title,
    } = context.query

    const database = getDatabase()

    const currPage = !Number.isNaN(Number.parseInt(page as string, 10)) ? Number.parseInt(page as string, 10) : 1

    const {
        items, pagesNumber, total, limit,
    } = await database.getAll({
        page: currPage,
        links: (links as string)?.split(ARRAY_SEPARATOR).filter(x => x),
        years: (years as string)?.split(ARRAY_SEPARATOR).filter(x => x),
        categories: (categories as string)?.split(ARRAY_SEPARATOR).filter(x => x),
        sort: sort as ESort,
        title: (title as string),
    })

    const params = await database.getParams()

    return {
        props: {
            items, pagesNumber, currPage, params, total, limit,
        },
    }
}

export default Index
