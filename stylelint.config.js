/** @type {import('stylelint').Config} */
export default {
    plugins: [
        '@stylistic/stylelint-plugin',
    ],
    extends: [
        'stylelint-config-standard-scss',
    ],
    overrides: [
        {
            files: ['*.scss', '**/*.scss'],
            extends: ['stylelint-config-standard-scss'],
        },
        {
            files: ['*.vue', '**/*.vue'],
            extends: [
                'stylelint-config-standard-scss',
                'stylelint-config-standard-vue/scss',
            ],
        },
    ],
    rules: {
        'selector-class-pattern': [
            '^[a-z0-9-]+$',
            {
                message: 'Use kebab-case for class selectors',
                severity: 'warning',
            },
        ],
        'block-no-empty': [
            [],
            {
                severity: 'warning',
            },
        ],
        'media-feature-range-notation': null,
        'no-descending-specificity': null,
        '@stylistic/block-opening-brace-space-before': 'always',
    },
}
