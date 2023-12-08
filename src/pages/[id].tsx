import React, { useEffect, useMemo, useState } from 'react'
import { Breadcrumb, Columns, Container, Content, Heading, Icon, Section } from 'react-bulma-components'
import Head from 'next/head'
import Link from 'next/link'
import classNames from 'classnames'
import { AiFillHome, AiOutlineShareAlt } from 'react-icons/ai'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import getConfig from 'next/config'
import CategoryIcon from 'components/category-icon'
import database from 'helpers/database'
import styles from 'styles/pages/[id].module.scss'
import type { GetServerSideProps, NextPage } from 'next'
import type { ItemType } from 'helpers/database'

const { publicRuntimeConfig } = getConfig()

export interface IdNextType {
    /** Item */
    item: ItemType
}

// eslint-disable-next-line react/function-component-definition
const Id: NextPage<IdNextType> = function Id({ item }) {
    const [canShare, setCanShare] = useState(false)

    const shareData: ShareData = useMemo(
        () => ({
            title: item.title,
            url: `/${item.folderId}`,
            text: '',
        }),
        [item],
    )

    const title = useMemo(() => `${item?.title || 'Unknown'} - In Flames Closet`, [item?.title])

    // We use a useEffect here, to be sure to be in a navigator context
    useEffect(() => {
        setCanShare(navigator.canShare?.(shareData))
    }, [shareData])

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content={[item?.title, item?.category, item?.year].filter(x => x).join(' - ')}
                />
                <meta
                    property="og:title"
                    content={`${item?.title || 'Unknown'} - In Flames Closet`}
                />
                <meta
                    property="og:description"
                    content={[item?.title, item?.category, item?.year].filter(x => x).join(' - ')}
                />
                <meta
                    property="og:image"
                    content={`${process.env.SITE_URL}/image/${item.folderId}/${item.imagesId[0]}`}
                />
                <meta
                    property="og:url"
                    content={`${process.env.SITE_URL}/${item.folderId}`}
                />

                <meta
                    property="twitter:title"
                    content={`${item?.title || 'Unknown'} - In Flames Closet`}
                />
                <meta
                    property="twitter:description"
                    content={[item?.title, item?.category, item?.year].filter(x => x).join(' - ')}
                />
                <meta
                    property="twitter:card"
                    content="summary_large_image"
                />
                <meta
                    property="twitter:image"
                    content={`${process.env.SITE_URL}/image/${item.folderId}/${item.imagesId[0]}`}
                />
                <meta
                    property="twitter:url"
                    content={`${process.env.SITE_URL}/${item.folderId}`}
                />
                <script
                    type="application/ld+json"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'http://schema.org',
                            '@type': 'Product',
                            name: item?.title,
                            description: item?.comment,
                            image: `${process.env.SITE_URL}/image/${item.folderId}/${item.imagesId[0]}`,
                            category: item?.category,
                            releaseDate: item?.year ? `${item.year}-01-01` : undefined,
                        }),
                    }}
                />
            </Head>
            <Section className={styles.id}>
                <Container>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link href="/">
                                <Icon>
                                    <AiFillHome />
                                </Icon>
                                <span>Home</span>
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>
                            <Icon>
                                <CategoryIcon name={item?.category} />
                            </Icon>
                            <span>{item?.title || 'Unknown'}</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Columns>
                        <Columns.Column size="half">
                            <Carousel
                                renderItem={el => <div className={styles['main-image-container']}>{el}</div>}
                                preventMovementUntilSwipeScrollTolerance
                                swipeScrollTolerance={30}
                            >
                                {item?.imagesId.map(imageId => (
                                    <React.Fragment key={imageId}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={`/image/${item.folderId}/${imageId}`}
                                            alt={item?.title}
                                            className={styles['main-image-background']}
                                        />
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={`/image/${item.folderId}/${imageId}`}
                                            alt={item?.title}
                                            className={styles['main-image']}
                                        />
                                        {/* <p className="legend">{item?.title}</p> */}
                                    </React.Fragment>
                                ))}
                            </Carousel>
                        </Columns.Column>
                        <Columns.Column size="half">
                            <Heading title={item?.title}>
                                {item?.title}
                                {canShare && (
                                    <>
                                        {' '}
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                try {
                                                    await navigator.share(shareData)
                                                } catch (error) {
                                                    // eslint-disable-next-line no-console
                                                    console.error(error)
                                                }
                                            }}
                                            aria-label="Share"
                                            title="Share"
                                            className={styles['share-button']}
                                        >
                                            <AiOutlineShareAlt />
                                        </button>
                                    </>
                                )}
                            </Heading>
                            <Heading
                                subtitle
                                renderAs="p"
                            >
                                <Link
                                    href={{
                                        pathname: '/',
                                        query: {
                                            categories: item?.category,
                                        },
                                    }}
                                >
                                    {item?.category || 'None'}
                                </Link>
                            </Heading>
                            <Content>
                                <p>
                                    <span className={classNames('label', styles.label)}>Year:</span>{' '}
                                    <Link
                                        href={{
                                            pathname: '/',
                                            query: {
                                                years: item?.year,
                                            },
                                        }}
                                    >
                                        {item?.year || 'None'}
                                    </Link>
                                </p>
                                <p>
                                    <span className={classNames('label', styles.label)}>Link:</span>{' '}
                                    <Link
                                        href={{
                                            pathname: '/',
                                            query: {
                                                links: item?.link,
                                            },
                                        }}
                                    >
                                        {item?.link || 'None'}
                                    </Link>
                                </p>
                                <p>
                                    <span className={classNames('label', styles.label)}>Official:</span>{' '}
                                    <span>{item?.official || 'None'}</span>
                                </p>
                                <p>
                                    <span className={classNames('label', styles.label)}>Source:</span> <span>{item?.source || 'None'}</span>
                                </p>
                                <p>
                                    <span className={classNames('label', styles.label)}>Comment:</span>{' '}
                                    <span>{item?.comment || 'None'}</span>
                                </p>
                                <a
                                    className="is-dark is-small is-size-7"
                                    // eslint-disable-next-line max-len
                                    href={encodeURI(
                                        `mailto:${publicRuntimeConfig.adminEmail}?subject=[In Flames Closet] Problem with ${item.title} (${item.folderId})&body=Hello,\rI think there is a problem with the item "${item.title}" (${item.folderId}:\r`,
                                    )}
                                >
                                    Report a problem
                                </a>
                            </Content>
                        </Columns.Column>
                    </Columns>
                </Container>
            </Section>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async context => {
    const { id } = context.query

    const item = await database.getById(id as string)

    return {
        notFound: !item,
        props: {
            item,
        },
    }
}

export default Id
