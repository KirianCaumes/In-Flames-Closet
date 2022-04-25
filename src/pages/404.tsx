import React from 'react'
import { NextPage } from 'next'
import {
    Breadcrumb,
    Button, Container, Heading, Icon, Section,
} from 'react-bulma-components'
import Link from 'next/link'
import { AiFillBackward, AiFillHome } from 'react-icons/ai'
import { BiErrorCircle } from 'react-icons/bi'
import { useRouter } from 'next/router'
import Head from 'next/head'

const My404: NextPage = function My404() {
    const router = useRouter()

    return (
        <>
            <Head>
                <title>Error - In Flames Closet</title>
                <meta
                    name="description"
                    content="404 not found."
                />
                <meta
                    name="robots"
                    content="noindex"
                />
            </Head>
            <Section>
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
                            <Link href="/error">
                                <a>
                                    <Icon>
                                        <BiErrorCircle />
                                    </Icon>
                                    <span>Error</span>
                                </a>
                            </Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Heading
                        size={5}
                        renderAs="h1"
                        className="has-text-centered"
                    >
                        404 - Page Not Found
                    </Heading>
                    <Heading
                        size={5}
                        renderAs="h2"
                        className="has-text-centered"
                        subtitle
                    >
                        The ressource was not found on the server.
                    </Heading>
                    <div
                        className="has-text-centered"
                    >
                        <Button
                            onClick={() => router.back()}
                            color="dark"
                        >
                            <Icon>
                                <AiFillBackward />
                            </Icon>
                            <span>Back</span>
                        </Button>
                        {' '}
                        <Link href="/">
                            <a className="button is-dark">
                                <Icon>
                                    <AiFillHome />
                                </Icon>
                                <span>Home</span>
                            </a>
                        </Link>
                    </div>
                </Container>
            </Section>
        </>
    )
}

export default My404
