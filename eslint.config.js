import esJsdoc from 'eslint-plugin-jsdoc'
import esJs from '@eslint/js'
import esReact from 'eslint-plugin-react'
import esTs from 'typescript-eslint'
import esCompat from 'eslint-plugin-compat'
import esPrettier from 'eslint-config-prettier'
import esReactRefresh from 'eslint-plugin-react-refresh'
import esImport from 'eslint-plugin-import-x'
import esReactHooks from 'eslint-plugin-react-hooks'
import esYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect'
import esReactCompiler from 'eslint-plugin-react-compiler'
import esNext from 'eslint-config-next/core-web-vitals'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
// eslint-disable-next-line import/no-anonymous-default-export
export default [
    {
        ignores: ['.next', 'node_modules', '.eslintcache', '.stylelintcache', 'public'],
    },
    esJsdoc.configs['flat/recommended-typescript'],
    esJs.configs.recommended,
    ...esTs.configs.strictTypeChecked,
    ...esTs.configs.stylisticTypeChecked,
    esCompat.configs['flat/recommended'],
    esReact.configs.flat.all,
    esImport.flatConfigs.recommended,
    esPrettier,
    esYouMightNotNeedAnEffect.configs.recommended,
    esReactHooks.configs.flat.recommended,
    esReactRefresh.configs.recommended,
    esReactCompiler.configs.recommended,
    ...esNext,
    {
        settings: {
            react: { version: 'detect' },
            'import-x/resolver': {
                typescript: {},
            },
        },
        languageOptions: {
            parser: esTs.parser,
            parserOptions: {
                project: ['tsconfig.json'],
            },
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            jsdoc: esJsdoc,
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'warn',
        },
        rules: {
            '@typescript-eslint/naming-convention': [
                'error',
                { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
                { selector: 'function', format: ['camelCase', 'PascalCase'] },
                { selector: 'typeLike', format: ['PascalCase'] },
                {
                    selector: 'variable',
                    types: ['boolean'],
                    format: ['PascalCase'],
                    prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'are'],
                    filter: {
                        regex: '^disabled$',
                        match: false,
                    },
                },
            ],
            '@typescript-eslint/consistent-type-imports': ['error'],
            '@typescript-eslint/array-type': ['error', { default: 'generic' }],
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                { allowAny: false, allowBoolean: true, allowNullish: false, allowNumber: true, allowRegExp: false, allowNever: false },
            ],
            '@typescript-eslint/no-misused-promises': [
                'error',
                {
                    checksVoidReturn: {
                        arguments: false,
                        attributes: false,
                        properties: false,
                    },
                },
            ],
            '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
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
            'import-x/order': ['error', { groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'] }],
            'arrow-body-style': ['error', 'as-needed'],
            'no-console': ['warn'],
            'object-shorthand': ['error'],
            'no-extend-native': ['error'],
            'no-nested-ternary': 'error',
            'prefer-template': 'error',
            'capitalized-comments': ['warn', 'always', { ignorePattern: 'cspell|prettier' }],
            camelcase: ['error', { properties: 'never', ignoreDestructuring: false }],
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'ForInStatement',
                    message:
                        // eslint-disable-next-line max-len
                        'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
                },
                {
                    selector: 'ForOfStatement',
                    message:
                        // eslint-disable-next-line max-len
                        'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
                },
                {
                    selector: 'LabeledStatement',
                    message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
                },
                {
                    selector: 'WithStatement',
                    message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
                },
                {
                    selector: 'TSEnumDeclaration',
                    message:
                        "Do not declare Enum, prefer 'as const' assertions. See: https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums",
                },
            ],
            curly: ['warn', 'all'],
            'max-len': ['warn', { code: 160 }],
            'no-restricted-imports': ['error', { patterns: ['../*', './*'] }],
            'no-restricted-modules': ['error', { patterns: ['../*', './*'] }],
            'no-extra-boolean-cast': ['error', { enforceForInnerExpressions: true }],
            'react/react-in-jsx-scope': 'off',
            'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
            'react/no-unescaped-entities': ['warn', { forbid: ['>', '}'] }],
            'react/require-default-props': ['error', { functions: 'defaultArguments' }],
            'react/jsx-no-leaked-render': 'off',
            'react/jsx-max-depth': ['error', { max: 10 }],
            'react/forbid-component-props': 'off',
            'react/jsx-no-bind': 'off',
            'react/jsx-no-literals': 'off',
            'react/no-multi-comp': ['error', { ignoreStateless: true }],
            'react/no-children-prop': [
                'error',
                {
                    allowFunctions: true,
                },
            ],
        },
    },
    {
        files: ['**.{mjs,js,cjs}'],
        rules: {
            'jsdoc/check-tag-names': ['warn', { typed: false }],
        },
    },
]
