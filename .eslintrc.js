/**
 * {@link https://eslint.org/docs/latest/use/configure/configuration-files} Documentation
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    extends: [
        'airbnb',
        'airbnb/hooks',
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@next/next/recommended',
        /**
         * Turns off all rules that are unnecessary or might conflict with Prettier.
         * Check conflict between Eslint and Prettier with: `npx eslint-config-prettier .eslintrc.js`.
         */
        'prettier',
    ],
    parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module',
    },
    plugins: ['jsdoc'],
    rules: {
        /** {@link https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections} */
        '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
        '@typescript-eslint/naming-convention': [
            // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
            ...require('eslint-config-airbnb-typescript/lib/shared').rules['@typescript-eslint/naming-convention'],
            {
                selector: 'variable',
                types: ['boolean'],
                format: ['PascalCase'],
                prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
            },
        ],
        '@typescript-eslint/consistent-type-imports': ['error'],
        /** {@link https://tkdodo.eu/blog/array-types-in-type-script} */
        '@typescript-eslint/array-type': ['error', { default: 'generic' }],
        'jsdoc/require-jsdoc': [
            'warn',
            {
                checkConstructors: false,
                contexts: [
                    'ClassDeclaration',
                    'FunctionDeclaration',
                    'MethodDefinition',
                    { context: 'TSPropertySignature', inlineCommentBlock: true },
                ],
            },
        ],
        'jsdoc/require-description': [
            'warn',
            {
                checkConstructors: false,
                contexts: [
                    'TSPropertySignature',
                    'ClassDeclaration',
                    'ArrowFunctionExpression',
                    'FunctionDeclaration',
                    'FunctionExpression',
                    'MethodDefinition',
                ],
            },
        ],
        'jsdoc/require-param-description': ['warn', { contexts: ['any'] }],
        'jsdoc/require-param': ['warn', { checkDestructuredRoots: false }],
        'import/order': ['error', { groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'] }],
        // 'capitalized-comments': ['warn', 'always'], // Not always useful as it also fix comment with code
        camelcase: ['error', { allow: [] }],
        'no-underscore-dangle': ['error', { allow: ['_id', '__WB_MANIFEST'] }],
        curly: ['warn', 'all'],
        'template-curly-spacing': 'off', // Issue: https://stackoverflow.com/questions/48391913/eslint-error-cannot-read-property-range-of-null
        'no-restricted-imports': ['error', { patterns: ['../*', './*'] }],
        'no-restricted-modules': ['error', { patterns: ['../*', './*'] }],
        'no-extra-boolean-cast': ['error', { enforceForLogicalOperands: true }],
        'react/react-in-jsx-scope': 0, // Not useful as vite auto add react in scope
        'react/function-component-definition': [2, { namedComponents: 'function-declaration' }],
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
        'react/no-unescaped-entities': ['warn', { forbid: ['>', '}'] }],
        'react/prop-types': 'off',
        'react/require-default-props': ['error', { functions: 'defaultArguments' }],
        'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }], // Must be at the end
    },
    ignorePatterns: ['!.stylelintrc.js', '!knip.js'],
    /** {@link https://github.com/import-js/eslint-plugin-import/issues/1485} */
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
}
