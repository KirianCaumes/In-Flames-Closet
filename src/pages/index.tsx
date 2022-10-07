import React from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import getDatabase, {
    ESort, ParamsType, ItemsResultType,
} from 'helpers/database'
import {
    Card, Columns, Container, Heading, Media, Form, Button, Section, Breadcrumb, Icon,
} from 'react-bulma-components'
import styles from 'styles/pages/index.module.scss'
import Head from 'next/head'
import { AiFillHome } from 'react-icons/ai'
import Pagination from 'components/pagination'
import { GrPowerReset } from 'react-icons/gr'
import CategoryIcon from 'components/categoryIcon'
import useIndex, { ARRAY_SEPARATOR, DEFAULT_DETAILS, DEFAULT_FILTERS } from 'hooks/pages/index.hook'

export type IndexNextType = {
    /** Params */
    params: ParamsType
} & ItemsResultType

const Index: NextPage<IndexNextType> = function Index({
    items, totalPages, params, total, limit,
}) {
    const {
        isDetailsOpen,
        setIsDetailsOpen,
        filters,
        setFilters,
        titleTimeoutRef,
        router,
    } = useIndex()

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
                                        onChange={ev => setFilters(prevFilters => ({
                                            ...prevFilters,
                                            page: 1,
                                            sort: ev.target.selectedOptions[0]?.value as 'new' | 'old',
                                        }))}
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
                                        defaultValue={filters.title}
                                        type="search"
                                        size="small"
                                        onChange={ev => {
                                            clearTimeout(titleTimeoutRef.current)
                                            titleTimeoutRef.current = setTimeout(() => setFilters(prevFilters => ({
                                                ...prevFilters,
                                                page: 1,
                                                title: ev.target.value,
                                            })), 250)
                                        }}
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
                                                onChange={ev => setFilters(prevFilters => ({
                                                    ...prevFilters,
                                                    page: 1,
                                                    links: ev.target.checked
                                                        ? [...filters.links, link]
                                                        : filters.links.filter(x => x !== link),
                                                }))}
                                            >
                                                {link}
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
                                                onChange={ev => setFilters(prevFilters => ({
                                                    ...prevFilters,
                                                    page: 1,
                                                    years: ev.target.checked
                                                        ? [...filters.years, year]
                                                        : filters.years.filter(x => x !== year),
                                                }))}
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
                                                onChange={ev => setFilters(prevFilters => ({
                                                    ...prevFilters,
                                                    page: 1,
                                                    categories: ev.target.checked
                                                        ? [...filters.categories, category]
                                                        : filters.categories.filter(x => x !== category),
                                                }))}
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
                                    setFilters(DEFAULT_FILTERS)
                                    setIsDetailsOpen(DEFAULT_DETAILS)
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
                                page={filters.page}
                                setPage={async newPage => {
                                    await router.push({ pathname: '/', query: { ...router.query, page: newPage } }, undefined, { scroll: true })
                                    setFilters(prevFilters => ({ ...prevFilters, page: newPage }))
                                }}
                                totalPages={totalPages}
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

    const {
        items, totalPages, total, limit,
    } = await database.getAll({
        page: !Number.isNaN(Number.parseInt(page as string, 10)) ? Number.parseInt(page as string, 10) : 1,
        links: (links as string)?.split(ARRAY_SEPARATOR).filter(x => x),
        years: (years as string)?.split(ARRAY_SEPARATOR).filter(x => x),
        categories: (categories as string)?.split(ARRAY_SEPARATOR).filter(x => x),
        sort: sort as ESort,
        title: (title as string),
    })

    const params = await database.getParams()

    return {
        props: {
            items, totalPages, params, total, limit,
        },
    }
}

export default Index
