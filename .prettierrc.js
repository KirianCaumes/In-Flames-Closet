/**
 * {@link https://prettier.io/docs/en/configuration.html} Documentation
 * @type {import('prettier').Config}
 */
module.exports = {
    tabWidth: 4,
    semi: false,
    singleQuote: true,
    printWidth: 140,
    arrowParens: 'avoid',
    singleAttributePerLine: true,
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '*.yml',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '*.scss',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '*.svg',
            options: {
                parser: 'html',
            },
        },
    ],
}
