module.exports = {
    parserOptions: {
        project: 'tsconfig.json',
        // sourceType: 'module',
    },
    extends: [
        'plugin:@next/next/recommended',
        'airbnb',
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    plugins: [
        'react',
        'react-hooks',
        'jsdoc',
        '@typescript-eslint/eslint-plugin',
    ],
    env: {
        browser: true,
        node: true,
        jest: true,
    },
    rules: {
        '@typescript-eslint/indent': ['error', 4, { ignoredNodes: ['TemplateLiteral'], SwitchCase: 1 }],
        '@typescript-eslint/semi': ['warn', 'never'],
        '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
        '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' }, singleline: { delimiter: 'comma' } }],
        '@typescript-eslint/naming-convention': [
            'error',
            { selector: 'interface', format: ['PascalCase'], custom: { regex: '^I[A-Z]', match: true } },
            { selector: 'enum', format: ['PascalCase'], custom: { regex: '^E[A-Z]', match: true } },
            {
                selector: 'variable', types: ['boolean'], format: ['PascalCase'], prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
            },
            { selector: 'typeAlias', format: ['PascalCase'], suffix: ['Type', 'State', 'Props', 'Returns', 'Params'] },
        ],
        'jsdoc/require-jsdoc': ['warn', {
            checkConstructors: false,
            contexts: [
                'ClassDeclaration', 'FunctionDeclaration', 'MethodDefinition',
                { context: 'TSPropertySignature', inlineCommentBlock: true }],
        }],
        'jsdoc/require-description': ['warn', {
            checkConstructors: false,
            contexts: [
                'TSPropertySignature', 'ClassDeclaration', 'ArrowFunctionExpression', 'FunctionDeclaration', 'FunctionExpression', 'MethodDefinition',
            ],
        }],
        'jsdoc/require-param-description': ['warn', { contexts: ['any'] }],
        'jsdoc/require-param': ['warn', { checkDestructuredRoots: false }],
        // 'capitalized-comments': ['warn', 'always'], // Not always usefull as it also fix comment with code
        'no-underscore-dangle': ['error', { allow: ['_id', '__WB_MANIFEST'] }],
        curly: ['warn', 'multi', 'consistent'],
        'template-curly-spacing': 'off', // Issue: https://stackoverflow.com/questions/48391913/eslint-error-cannot-read-property-range-of-null
        'max-len': ['warn', { code: 160 }],
        'comma-dangle': ['warn', 'always-multiline'],
        'nonblock-statement-body-position': ['warn', 'below'],
        'arrow-parens': ['warn', 'as-needed'],
        'no-restricted-imports': ['error', { patterns: ['../*', './*'] }],
        'no-restricted-modules': ['error', { patterns: ['../*', './*'] }],
        'function-paren-newline': ['error', 'consistent'],
        'no-extra-boolean-cast': ['error', { enforceForLogicalOperands: true }],
        'react/react-in-jsx-scope': 0, // Not usefull as vite auto add react in scope
        // 'react/function-component-definition': [2, { namedComponents: 'function-declaration' }],
        'react/jsx-filename-extension': [
            'error',
            { extensions: ['.tsx', '.jsx'] },
        ],
        'react/jsx-first-prop-new-line': ['warn', 'multiline'],
        'react/jsx-max-props-per-line': ['warn', { maximum: 1, when: 'always' }],
        'react/jsx-indent-props': ['warn', 4],
        'react/no-unescaped-entities': ['warn', { forbid: ['>', '}'] }],
        'react/prop-types': 'off',
        'react/jsx-indent': ['warn', 4],
        'react/jsx-one-expression-per-line': ['warn', { allow: 'single-child' }],
        // 'react/require-default-props': ['error', { functions: 'defaultArguments' }],
        'jsx-a11y/anchor-is-valid': 'off',
        'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }], // Must be at the end
    },
}
