import Link from 'next/link'
import React, { ReactNode } from 'react'
import {
    Container, Content, Footer, Heading, Hero,
} from 'react-bulma-components'
import styles from 'styles/components/layout.module.scss'

/**
 * Layout
 */
export default function Layout({ children }: {
    /** Children */
    children: ReactNode
}) {
    return (
        <div className={styles.layout}>
            <header className={styles['layout-hero']}>
                <Hero color="black">
                    <Hero.Body>
                        <Container>
                            <Heading>
                                <Link href="/">
                                    In Flames Closet
                                </Link>
                            </Heading>
                            <Heading
                                size={5}
                                subtitle
                                renderAs="p"
                            >
                                The history of In Flames through their artworks: clothes, goodies, and more!
                                {' '}
                                <span
                                    role="img"
                                    aria-label="smiling"
                                >
                                    😈
                                </span>
                            </Heading>
                        </Container>
                    </Hero.Body>
                </Hero>
            </header>
            <main className={styles['layout-main']}>
                {children}
            </main>
            <Footer className={styles['layout-footer']}>
                <Container>
                    <Content>
                        <p>
                            <strong>In Flames Closet</strong>
                            {' '}
                            by
                            {' '}
                            <a
                                href="https://kiriancaumes.fr"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Kirian CAUMES
                            </a>
                            {' '}
                            -
                            {' '}
                            <a
                                href="https://jesterscollection.kiriancaumes.fr/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                A Jester's Collection
                            </a>
                            . I do not own the images. All rights reserved to
                            {' '}
                            <a
                                href="https://www.inflames.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                In Flames
                            </a>
                            .
                        </p>
                    </Content>
                </Container>
            </Footer>
        </div>
    )
}
