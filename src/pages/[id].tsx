import React from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import getDatabase, { Item } from 'helpers/database'
import {
    Breadcrumb, Columns, Container, Content, Heading, Icon, Section,
} from 'react-bulma-components'
import styles from 'styles/pages/[id].module.scss'
import Head from 'next/head'
import ImageGallery from 'react-image-gallery'
import Link from 'next/link'
import classNames from 'classnames'
import { AiFillHome } from 'react-icons/ai'
import {
    FaBoxOpen, FaGraduationCap, FaTshirt, FaVestPatches,
} from 'react-icons/fa'
import { IoShirtSharp } from 'react-icons/io5'
import { MdInsertPhoto } from 'react-icons/md'
import { GiArmoredPants } from 'react-icons/gi'

// eslint-disable-next-line arrow-body-style
const Index: NextPage<{ item: Item }> = function Index({ item }) {
    return (
        <>
            <Head>
                <title>
                    {item?.title || 'Unknown'}
                    {' '}
                    - In Flames Closet
                </title>
                <meta
                    name="description"
                    content={[item?.title, item?.category, item?.year].filter(x => x).join(' - ')}
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
                            image: `http://drive.google.com/uc?export=view&id=${item?.imagesId[0]}`,
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
                                <a>
                                    <Icon>
                                        <AiFillHome />
                                    </Icon>
                                    <span>Home</span>
                                </a>
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>
                            <a>
                                <Icon>
                                    {item?.category === 'T-Shirt' && <IoShirtSharp />}
                                    {item?.category === 'Sweater' && <FaTshirt />}
                                    {item?.category === 'Long Sleeve' && <FaTshirt />}
                                    {item?.category === 'Poster' && <MdInsertPhoto />}
                                    {item?.category === 'Patch' && <FaVestPatches />}
                                    {item?.category === 'Trouser' && <GiArmoredPants />}
                                    {item?.category === 'Cap' && <FaGraduationCap />}
                                    {(item?.category === 'Other' || !item?.category) && <FaBoxOpen />}
                                </Icon>
                                <span>{item?.title || 'Unknown'}</span>
                            </a>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Columns>
                        <Columns.Column size="half">
                            <ImageGallery
                                items={item?.imagesId.map(imageId => ({
                                    original: `https://drive.google.com/uc?id=${imageId}`,
                                    thumbnail: `https://drive.google.com/uc?id=${imageId}`,
                                    originalClass: styles['image-container'],
                                    originalAlt: item?.title,
                                    thumbnailAlt: item?.title,
                                }))}
                                showPlayButton={false}
                            />
                        </Columns.Column>
                        <Columns.Column size="half">
                            <Heading>
                                {item?.title}
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
                                    <a>
                                        {item?.category || 'None'}
                                    </a>
                                </Link>
                            </Heading>
                            <Content>
                                <p>
                                    <span className={classNames('label', styles.label)}>
                                        Year:
                                    </span>
                                    {' '}
                                    <Link
                                        href={{
                                            pathname: '/',
                                            query: {
                                                years: item?.year,
                                            },
                                        }}
                                    >
                                        <a>
                                            {item?.year || 'None'}
                                        </a>
                                    </Link>
                                </p>
                                <p>
                                    <span className={classNames('label', styles.label)}>
                                        Link:
                                    </span>
                                    {' '}
                                    <Link
                                        href={{
                                            pathname: '/',
                                            query: {
                                                links: item?.link,
                                            },
                                        }}
                                    >
                                        <a>
                                            {item?.link || 'None'}
                                        </a>
                                    </Link>
                                </p>
                                <p>
                                    <span className={classNames('label', styles.label)}>
                                        Official:
                                    </span>
                                    {' '}
                                    <span>
                                        {item?.official || 'None'}
                                    </span>
                                </p>
                                <p>
                                    <span className={classNames('label', styles.label)}>
                                        Source:
                                    </span>
                                    {' '}
                                    <span>
                                        {item?.source || 'None'}
                                    </span>
                                </p>
                                <p>
                                    <span className={classNames('label', styles.label)}>
                                        Comment:
                                    </span>
                                    {' '}
                                    <span>
                                        {item?.comment || 'None'}
                                    </span>
                                </p>
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

    const database = getDatabase()
    const item = await database.getById(id as string)

    return {
        notFound: !item,
        props: {
            item,
        },
    }
}

export default Index
