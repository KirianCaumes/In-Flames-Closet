/* eslint-disable jsdoc/require-jsdoc, @typescript-eslint/consistent-type-definitions */
export type Styles = {
    'gdpr-banner': string
    'gdpr-banner-content': string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
