/* eslint-disable jsdoc/require-jsdoc, @typescript-eslint/consistent-type-definitions */
export type Styles = {
    id: string
    label: string
    'main-image': string
    'main-image-background': string
    'main-image-container': string
    'share-button': string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
