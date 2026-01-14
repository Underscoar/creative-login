// eslint.config.js
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import perfectionist from 'eslint-plugin-perfectionist'
import eslintPluginJsonc from 'eslint-plugin-jsonc'
import vueI18n from '@intlify/eslint-plugin-vue-i18n'

export default [
    { files: ['**/*.{js,mjs,cjs,ts,vue,json}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    ...eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
    stylistic.configs.recommended,
    ...vueI18n.configs.recommended,
    {
        plugins: {
            '@stylistic': stylistic,
            perfectionist: perfectionist,
        },
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: { parser: tseslint.parser },
        },
    },
    {
        ignores: ['package.json', 'tsconfig.app.json', 'tsconfig.node.json', ''],
        rules: {
            // Vue rules
            'vue/multi-word-component-names': 'off',
            'vue/html-indent': ['error', 4],
            'vue/html-self-closing': [
                'error',
                {
                    html: {
                        void: 'never',
                        normal: 'never',
                        component: 'always',
                    },
                    svg: 'always',
                    math: 'always',
                },
            ],
            'vue/max-attributes-per-line': [
                'error',
                {
                    singleline: {
                        max: 3,
                    },
                    multiline: {
                        max: 1,
                    },
                },
            ],
            'vue/first-attribute-linebreak': ['error', {
                singleline: 'beside',
                multiline: 'below',
            }],
            'vue/attribute-hyphenation': ['error', 'always', {
                ignore: [],
            }],
            'vue/component-name-in-template-casing': ['error', 'PascalCase', {
                registeredComponentsOnly: false, // Enforce for all components, even global ones
                ignores: [],
            }],
            'vue/prop-name-casing': 'off',

            // TS rules
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    varsIgnorePattern: '^props$',
                },
            ],

            // Stylistic rules
            '@stylistic/indent': ['error', 4],
            '@stylistic/semi': ['error', 'never'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/type-annotation-spacing': ['error'],
            '@stylistic/quote-props': ['error', 'as-needed'],
            '@stylistic/operator-linebreak': 'off',
            '@stylistic/max-statements-per-line': ['error', { max: 2 }],
            '@stylistic/arrow-parens': 'off',

            // Perfectionist rules
            'perfectionist/sort-interfaces': [
                'error',
                {
                    type: 'alphabetical',
                    order: 'asc',
                    fallbackSort: { type: 'unsorted' },
                    ignoreCase: true,
                    specialCharacters: 'keep',
                    sortBy: 'name',
                    ignorePattern: [],
                    partitionByComment: false,
                    partitionByNewLine: false,
                    newlinesBetween: 'ignore',
                    useConfigurationIf: {},
                    groupKind: 'mixed',
                    groups: [],
                    customGroups: [],
                },
            ],

            // JSONC rules
            'jsonc/sort-keys': ['error',
                'asc',
                {
                    caseSensitive: false,
                    natural: false,
                    minKeys: 2,
                    allowLineSeparatedGroups: false,
                },
            ],

            // VueI18n rules
            '@intlify/vue-i18n/no-raw-text': [
                'off',
                {},
            ],
            // '@intlify/vue-i18n/no-missing-keys': 'off',
        },
    },
]
