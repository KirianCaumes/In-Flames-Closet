/* eslint-disable jsdoc/require-jsdoc, @typescript-eslint/consistent-type-definitions */
export type Styles = {
    layout: string
    'layout-footer': string
    'layout-hero': string
    'layout-main': string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
