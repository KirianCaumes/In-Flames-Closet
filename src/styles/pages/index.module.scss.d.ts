/* eslint-disable jsdoc/require-jsdoc, @typescript-eslint/consistent-type-definitions */
export type Styles = {
    card: string
    'card-image-container': string
    'card-image-container-background': string
    'card-image-container-main': string
    cards: string
    columns: string
    index: string
    'left-column': string
    'left-column-button-reset': string
    'right-column': string
    'right-column-top': string
    'right-column-top-left': string
    'right-column-top-right': string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
