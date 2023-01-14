import React, { useEffect, useRef, useState } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import getDatabase, { ParamsType } from 'helpers/database'
import {
    Card, Columns, Container, Heading, Media, Form, Button, Section, Breadcrumb, Icon,
} from 'react-bulma-components'
import styles from 'styles/pages/index.module.scss'
import Head from 'next/head'
import { AiFillHome } from 'react-icons/ai'
import Pagination from 'components/pagination'
import { GrPowerReset, GrStatusUnknown } from 'react-icons/gr'
import CategoryIcon from 'components/category-icon'
import setNativeValue from 'helpers/set-native-value'
import { useRouter } from 'next/router'
import albums from 'helpers/albums'
import Image from 'next/image'

export type IndexNextType = {
    /** Params */
    params: ParamsType
    /** Filters */
    filters: import('helpers/database').FiltersType
} & import('helpers/database').ItemsResultType

const Index: NextPage<IndexNextType> = function Index({
    items,
    pages,
    params,
    total,
    limit,
    filters,
}) {
    const router = useRouter()

    const [isDetailsOpen, setIsDetailsOpen] = useState({ links: true, years: false, categories: false })

    const titleTimeoutRef = useRef<NodeJS.Timeout>(0 as never)
    const titleInputRef = useRef<HTMLInputElement>(null)

    // Update field title when query is not the same as current value
    useEffect(() => {
        if (router.query.title !== titleInputRef.current?.value)
            setNativeValue(titleInputRef.current as HTMLInputElement, router.query.title?.toString() ?? '')
    }, [router.query.title])

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
                                        onChange={({ target }) => router.push({
                                            pathname: '/',
                                            query: {
                                                ...router.query,
                                                page: 1,
                                                sort: target.selectedOptions[0]?.value as 'new' | 'old',
                                            },
                                        })}
                                        size="small"
                                        value={filters.sort}
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
                                        defaultValue={filters.title}
                                        type="search"
                                        size="small"
                                        onChange={({ target }) => {
                                            clearTimeout(titleTimeoutRef.current)
                                            titleTimeoutRef.current = setTimeout(() => router.push({
                                                pathname: '/',
                                                query: {
                                                    ...router.query,
                                                    page: 1,
                                                    title: target.value,
                                                },
                                            }), 250)
                                        }}
                                        domRef={titleInputRef as never}
                                    />
                                </Form.Control>
                            </Form.Field>
                            <details
                                open={isDetailsOpen.links}
                            >
                                <summary
                                    onClick={ev => {
                                        ev.preventDefault()
                                        setIsDetailsOpen(prevIsDetailsOpen => ({
                                            links: !prevIsDetailsOpen.links,
                                            years: false,
                                            categories: false,
                                        }))
                                    }}
                                    className="label"
                                >
                                    Linked to:
                                </summary>
                                <Form.Field>
                                    {params.links.map(link => (
                                        <Form.Control key={link}>
                                            <Form.Checkbox
                                                checked={filters.links.includes(link)}
                                                onChange={({ target }) => router.push({
                                                    pathname: '/',
                                                    query: {
                                                        ...router.query,
                                                        page: 1,
                                                        links: target.checked
                                                            ? [...filters.links, link]
                                                            : filters.links.filter(x => x !== link),
                                                    },
                                                })}
                                            >
                                                <Icon>
                                                    {albums[link]
                                                        ? (
                                                            <Image
                                                                src={albums[link]}
                                                                alt={link}
                                                                decoding="async"
                                                                loading="lazy"
                                                                layout="fixed"
                                                                width={14}
                                                                height={14}
                                                            />
                                                        )
                                                        : <GrStatusUnknown />}
                                                </Icon>
                                                <span>
                                                    {link}
                                                </span>
                                            </Form.Checkbox>
                                        </Form.Control>
                                    ))}
                                </Form.Field>
                            </details>
                            <details
                                open={isDetailsOpen.years}
                            >
                                <summary
                                    onClick={ev => {
                                        ev.preventDefault()
                                        setIsDetailsOpen(prevIsDetailsOpen => ({
                                            links: false,
                                            years: !prevIsDetailsOpen.years,
                                            categories: false,
                                        }))
                                    }}
                                    className="label"
                                >
                                    Years:
                                </summary>
                                <Form.Field>
                                    {params.years.map(year => (
                                        <Form.Control key={year}>
                                            <Form.Checkbox
                                                checked={filters.years.includes(year)}
                                                onChange={({ target }) => router.push({
                                                    pathname: '/',
                                                    query: {
                                                        ...router.query,
                                                        page: 1,
                                                        years: target.checked
                                                            ? [...filters.years, year]
                                                            : filters.years.filter(x => x !== year),
                                                    },
                                                })}
                                            >
                                                {year}
                                            </Form.Checkbox>
                                        </Form.Control>
                                    ))}
                                </Form.Field>
                            </details>
                            <details
                                open={isDetailsOpen.categories}
                            >
                                <summary
                                    onClick={ev => {
                                        ev.preventDefault()
                                        setIsDetailsOpen(prevIsDetailsOpen => ({
                                            links: false,
                                            years: false,
                                            categories: !prevIsDetailsOpen.categories,
                                        }))
                                    }}
                                    className="label"
                                >
                                    Categories:
                                </summary>
                                <Form.Field>
                                    {params.categories.map(category => (
                                        <Form.Control key={category}>
                                            <Form.Checkbox
                                                checked={filters.categories.includes(category)}
                                                onChange={({ target }) => router.push({
                                                    pathname: '/',
                                                    query: {
                                                        ...router.query,
                                                        page: 1,
                                                        categories: target.checked
                                                            ? [...filters.categories, category]
                                                            : filters.categories.filter(x => x !== category),
                                                    },
                                                })}
                                            >
                                                <Icon>
                                                    <CategoryIcon name={category} />
                                                </Icon>
                                                <span>
                                                    {category}
                                                </span>
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
                                    setIsDetailsOpen({
                                        links: true,
                                        years: false,
                                        categories: false,
                                    })
                                    setNativeValue(titleInputRef.current as HTMLInputElement, '')
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
                                                </Media.Item>
                                            </Media>
                                        </Card.Content>
                                        <Card.Footer>
                                            <Card.Footer.Item title={item?.category}>
                                                <CategoryIcon name={item?.category} />
                                                <span>{item?.category || 'Unknown'}</span>
                                            </Card.Footer.Item>
                                            <Card.Footer.Item title={item?.link}>
                                                {albums[item?.link]
                                                    ? (
                                                        <Image
                                                            src={albums[item?.link]}
                                                            alt={item?.link}
                                                            decoding="async"
                                                            loading="lazy"
                                                            layout="fixed"
                                                            width={16}
                                                            height={16}
                                                        />
                                                    )
                                                    : <GrStatusUnknown />}
                                                <span>{item?.link || 'Unknown'}</span>
                                            </Card.Footer.Item>
                                        </Card.Footer>
                                    </Card>
                                ))}
                            </div>
                            <br />
                            <Pagination
                                page={filters.page}
                                pages={pages}
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

    const filters: import('helpers/database').FiltersType = {
        page: !Number.isNaN(Number.parseInt(page as string, 10)) ? Number.parseInt(page as string, 10) : 1,
        // eslint-disable-next-line no-nested-ternary
        links: links ? (Array.isArray(links) ? links : [links]) : [],
        // eslint-disable-next-line no-nested-ternary
        years: years ? (Array.isArray(years) ? years : [years]) : [],
        // eslint-disable-next-line no-nested-ternary
        categories: categories ? (Array.isArray(categories) ? categories : [categories]) : [],
        sort: sort as import('helpers/database').FiltersType['sort'] || 'new',
        title: (title as string) || '',
    }

    const [
        {
            items, pages, total, limit,
        },
        params,
    ] = await Promise.all([
        database.getAll(filters),
        database.getParams(),
    ])

    return {
        props: {
            items,
            pages,
            params,
            total,
            limit,
            filters,
        },
    }
}

export default Index
