import React, { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { Card, Columns, Container, Heading, Media, Form, Button, Section, Breadcrumb, Icon } from 'react-bulma-components'
import Head from 'next/head'
import { AiFillHome } from 'react-icons/ai'
import { GrPowerReset, GrStatusUnknown } from 'react-icons/gr'
import { useRouter } from 'next/router'
import Image from "next/legacy/image"
import database from 'helpers/database'
import styles from 'styles/pages/index.module.scss'
import Pagination from 'components/pagination'
import CategoryIcon from 'components/category-icon'
import setNativeValue from 'helpers/set-native-value'
import albums from 'helpers/albums'
import type { FiltersType, ItemsResultType, ParamsType } from 'helpers/database'
import type { KeyboardEvent, MouseEvent } from 'react'
import type { GetServerSideProps, NextPage } from 'next'

export type IndexNextType = {
    /** Params */
    params: ParamsType
    /** Filters */
    filters: FiltersType
} & ItemsResultType

// eslint-disable-next-line react/function-component-definition
const Index: NextPage<IndexNextType> = function Index({ items, pages, params, total, limit, filters }) {
    const router = useRouter()

    const [isDetailsOpen, setIsDetailsOpen] = useState({ links: true, years: false, categories: false })

    const titleTimeoutRef = useRef<NodeJS.Timeout>(0 as never)
    const titleInputRef = useRef<HTMLInputElement>(null)

    const onSummaryYearsClick = useCallback((ev: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
        ev.preventDefault()
        setIsDetailsOpen(prevIsDetailsOpen => ({
            links: false,
            years: !prevIsDetailsOpen.years,
            categories: false,
        }))
    }, [])

    const onSummaryCategoriesClick = useCallback((ev: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
        ev.preventDefault()
        setIsDetailsOpen(prevIsDetailsOpen => ({
            links: false,
            years: false,
            categories: !prevIsDetailsOpen.categories,
        }))
    }, [])

    const onSummaryLinkedClick = useCallback((ev: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
        ev.preventDefault()
        setIsDetailsOpen(prevIsDetailsOpen => ({
            links: !prevIsDetailsOpen.links,
            years: false,
            categories: false,
        }))
    }, [])

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
                                        <Icon>
                                            <AiFillHome />
                                        </Icon>
                                        <span>Home</span>
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
                                        {limit > total ? total : limit} of {total || 0} result(s) found
                                    </span>
                                </div>
                                <div className={styles['right-column-top-right']}>
                                    <span>Sort by: </span>
                                    <Form.Select
                                        onChange={({ target }) =>
                                            router.push({
                                                pathname: '/',
                                                query: {
                                                    ...router.query,
                                                    page: 1,
                                                    sort: target.selectedOptions[0]?.value as 'new' | 'old',
                                                },
                                            })
                                        }
                                        size="small"
                                        value={filters.sort}
                                    >
                                        <option value="new">Newly added</option>
                                        <option value="old">Formerly added</option>
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
                                <Form.Label>Title</Form.Label>
                                <Form.Control>
                                    <Form.Input
                                        placeholder="Title"
                                        defaultValue={filters.title}
                                        type="search"
                                        size="small"
                                        onChange={({ target }) => {
                                            clearTimeout(titleTimeoutRef.current)
                                            titleTimeoutRef.current = setTimeout(
                                                () =>
                                                    router.push({
                                                        pathname: '/',
                                                        query: {
                                                            ...router.query,
                                                            page: 1,
                                                            title: target.value,
                                                        },
                                                    }),
                                                250,
                                            )
                                        }}
                                        domRef={titleInputRef as never}
                                    />
                                </Form.Control>
                            </Form.Field>
                            <details open={isDetailsOpen.links}>
                                <summary
                                    onClick={onSummaryLinkedClick}
                                    onKeyDown={onSummaryLinkedClick}
                                    role="button"
                                    tabIndex={0}
                                    className="label"
                                >
                                    Linked to:
                                </summary>
                                <Form.Field>
                                    {params.links.map(link => (
                                        <Form.Control key={link}>
                                            <Form.Checkbox
                                                checked={filters.links.includes(link)}
                                                onChange={({ target }) =>
                                                    router.push(
                                                        {
                                                            pathname: '/',
                                                            query: {
                                                                ...router.query,
                                                                page: 1,
                                                                links: target.checked
                                                                    ? [...filters.links, link]
                                                                    : filters.links.filter(x => x !== link),
                                                            },
                                                        },
                                                        undefined,
                                                        { scroll: false },
                                                    )
                                                }
                                            >
                                                <Icon>
                                                    {albums[link] ? (
                                                        <Image
                                                            src={albums[link]}
                                                            alt={link}
                                                            decoding="async"
                                                            loading="lazy"
                                                            layout="fixed"
                                                            width={14}
                                                            height={14}
                                                        />
                                                    ) : (
                                                        <GrStatusUnknown />
                                                    )}
                                                </Icon>
                                                <span>{link}</span>
                                            </Form.Checkbox>
                                        </Form.Control>
                                    ))}
                                </Form.Field>
                            </details>
                            <details open={isDetailsOpen.years}>
                                <summary
                                    onClick={onSummaryYearsClick}
                                    onKeyDown={onSummaryYearsClick}
                                    role="button"
                                    tabIndex={0}
                                    className="label"
                                >
                                    Years:
                                </summary>
                                <Form.Field>
                                    {params.years.map(year => (
                                        <Form.Control key={year}>
                                            <Form.Checkbox
                                                checked={filters.years.includes(year)}
                                                onChange={({ target }) =>
                                                    router.push(
                                                        {
                                                            pathname: '/',
                                                            query: {
                                                                ...router.query,
                                                                page: 1,
                                                                years: target.checked
                                                                    ? [...filters.years, year]
                                                                    : filters.years.filter(x => x !== year),
                                                            },
                                                        },
                                                        undefined,
                                                        { scroll: false },
                                                    )
                                                }
                                            >
                                                {year}
                                            </Form.Checkbox>
                                        </Form.Control>
                                    ))}
                                </Form.Field>
                            </details>
                            <details open={isDetailsOpen.categories}>
                                <summary
                                    onClick={onSummaryCategoriesClick}
                                    onKeyDown={onSummaryCategoriesClick}
                                    role="button"
                                    tabIndex={0}
                                    className="label"
                                >
                                    Categories:
                                </summary>
                                <Form.Field>
                                    {params.categories.map(category => (
                                        <Form.Control key={category}>
                                            <Form.Checkbox
                                                checked={filters.categories.includes(category)}
                                                onChange={({ target }) =>
                                                    router.push(
                                                        {
                                                            pathname: '/',
                                                            query: {
                                                                ...router.query,
                                                                page: 1,
                                                                categories: target.checked
                                                                    ? [...filters.categories, category]
                                                                    : filters.categories.filter(x => x !== category),
                                                            },
                                                        },
                                                        undefined,
                                                        { scroll: false },
                                                    )
                                                }
                                            >
                                                <Icon>
                                                    <CategoryIcon name={category} />
                                                </Icon>
                                                <span>{category}</span>
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
                            <div className={styles.cards}>
                                {items.map(item => (
                                    <Card
                                        key={item.folderId}
                                        className={styles.card}
                                        renderAs="article"
                                    >
                                        <Link
                                            href={`/${item.folderId}`}
                                            title={item?.title}
                                        >
                                            <div className="card-image">
                                                <figure className={styles['card-image-container']}>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={`/image/${item.folderId}/${item?.imagesId[0]}`}
                                                        alt={item.title}
                                                        decoding="async"
                                                        loading="lazy"
                                                        className={styles['card-image-container-background']}
                                                    />
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={`/image/${item.folderId}/${item?.imagesId[0]}`}
                                                        alt={item.title}
                                                        decoding="async"
                                                        loading="lazy"
                                                        className={styles['card-image-container-main']}
                                                    />
                                                </figure>
                                            </div>
                                        </Link>
                                        <Card.Content>
                                            <Media>
                                                <Media.Item>
                                                    <Heading
                                                        size={6}
                                                        renderAs="h2"
                                                        title={item?.title}
                                                    >
                                                        <Link href={`/${item.folderId}`}>{item.title}</Link>
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
                                                {albums[item?.link] ? (
                                                    <Image
                                                        src={albums[item?.link]}
                                                        alt={item?.link}
                                                        decoding="async"
                                                        loading="lazy"
                                                        layout="fixed"
                                                        width={16}
                                                        height={16}
                                                    />
                                                ) : (
                                                    <GrStatusUnknown />
                                                )}
                                                <span>
                                                    {(item?.link.length > 10 && item?.link.split(' ').length > 1
                                                        ? item?.link
                                                              .split(' ')
                                                              .map(x => x.charAt(0))
                                                              .join('')
                                                              .toUpperCase()
                                                        : item?.link) || 'Unknown'}
                                                </span>
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
    const { page, links, years, categories, sort, title } = context.query

    const filters: FiltersType = {
        page: !Number.isNaN(Number.parseInt(page as string, 10)) ? Number.parseInt(page as string, 10) : 1,
        // eslint-disable-next-line no-nested-ternary
        links: links ? (Array.isArray(links) ? links : [links]) : [],
        // eslint-disable-next-line no-nested-ternary
        years: years ? (Array.isArray(years) ? years : [years]) : [],
        // eslint-disable-next-line no-nested-ternary
        categories: categories ? (Array.isArray(categories) ? categories : [categories]) : [],
        sort: (sort as FiltersType['sort']) || 'new',
        title: (title as string) || '',
    }

    const [{ items, pages, total, limit }, params] = await Promise.all([database.getAll(filters), database.getParams()])

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
