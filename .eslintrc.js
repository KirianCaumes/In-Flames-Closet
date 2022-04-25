module.exports = {
    // parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        // sourceType: 'module',
    },
    settings: {
        react: { version: 'detect' },
        // 'import/resolver': {
        //     node: {
        //         paths: ['src'],
        //         extensions: ['.ts', '.tsx'],
        //     },
        //     typescript: {
        //         alwaysTryTypes: true,
        //     },
        // },
        // jsdoc: {
        //     mode: 'typescript',
        // },
    },
    extends: [
        'airbnb',
        'airbnb-base',
        'airbnb-typescript/base',
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@next/next/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    plugins: ['react', 'react-hooks', '@typescript-eslint/eslint-plugin',],
    env: {
        node: true,
        jest: true,
    },
    root: true,
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/semi': ['warn', 'never'],
        '@typescript-eslint/indent': ['warn', 4, { SwitchCase: 1 }],
        curly: ['warn', 'multi', 'consistent'],
        'max-len': ['warn', { code: 160 }],
        'comma-dangle': ['warn', 'always-multiline'],
        'nonblock-statement-body-position': ['warn', 'below'],
        'arrow-parens': ['warn', 'as-needed'],
        'no-restricted-imports': ['error', { patterns: ['../*', './*'] }],
        'no-restricted-modules': ['error', { patterns: ['../*', './*'] }],
        'function-paren-newline': ['error', 'consistent'],
        'no-extra-boolean-cast': ['error', { enforceForLogicalOperands: true }],
        'react/jsx-filename-extension': [
            'error',
            { extensions: ['.ts', '.tsx'] },
        ],
        'react/jsx-first-prop-new-line': ['warn', 'multiline'],
        'react/jsx-max-props-per-line': ['warn', { maximum: 1, when: 'always' }],
        'react/jsx-indent-props': ['warn', 4],
        'react/no-unescaped-entities': ['warn', { forbid: ['>', '}'] }],
        'react/prop-types': 'off',
        'react/jsx-indent': ['warn', 4],
        'react/jsx-one-expression-per-line': ['warn', { allow: 'single-child' }],
        'jsx-a11y/anchor-is-valid': 'off'
    },
};