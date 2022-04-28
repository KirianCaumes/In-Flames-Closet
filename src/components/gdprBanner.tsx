import React, { useCallback, useEffect, useState } from 'react'
import { Button, Icon } from 'react-bulma-components'
import { FaCookieBite, FaTimes } from 'react-icons/fa'
import Cookie from 'helpers/cookie'
import styles from 'styles/components/gdpr-banner.module.scss'
import ReactGA from 'react-ga4'

const ACCEPT_COOKIE_NAME = 'accept_cookies'

export default function GdprBanner() {
    const [isVisible, setIsVisible] = useState(false)

    const onAccept = useCallback(() => {
        ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string, { gaOptions: { cookieFlags: 'SameSite=None;Secure' } })
        ReactGA.send('pageview')
        Cookie.set('true', ACCEPT_COOKIE_NAME)
        setIsVisible(false)
    }, [])

    const onRefuse = useCallback(() => {
        setIsVisible(false)
        Cookie.set('false', ACCEPT_COOKIE_NAME)
        Cookie.remove('_ga')
        Cookie.remove('_gat')
        Cookie.remove('_gid')
    }, [])

    useEffect(() => {
        const cookie = Cookie.get(null, ACCEPT_COOKIE_NAME)

        if (!cookie)
            setIsVisible(true)

        if (cookie === 'true')
            onAccept()
    }, [onAccept])

    if (!isVisible)
        return null

    return (
        <div className={styles['gdpr-banner']}>
            <p className={styles['gdpr-banner-content']}>
                {/* eslint-disable-next-line max-len */}
                This site uses cookies to analyze your preferences anonymously via Google Analytics. You can accept this to allow us to improve your experience or refuse it.
            </p>
            <Button.Group align="center">
                <Button
                    color="dark"
                    type="submit"
                    onClick={() => onAccept()}
                >
                    <Icon>
                        <FaCookieBite />
                    </Icon>
                    <span>Accept cookies</span>
                </Button>
                <Button
                    color="dark"
                    onClick={() => onRefuse()}
                    type="button"
                >
                    <Icon>
                        <FaTimes />
                    </Icon>
                    <span>Refuse cookies</span>
                </Button>
            </Button.Group>
        </div>
    )
}
