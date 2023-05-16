module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // https://eslint.org/docs/latest/rules/comma-dangle
    'comma-dangle': ['error', 'always-multiline'],

    // https://eslint.org/docs/latest/rules/quotes
    'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],

    // https://eslint.org/docs/latest/rules/semi
    'semi': ['error', 'never'],

    // https://eslint.org/docs/latest/rules/object-curly-spacing
    'object-curly-spacing': ['error', 'always'],

    // https://eslint.org/docs/latest/rules/array-bracket-spacing
    'array-bracket-spacing': ['error', 'never'],

    // https://eslint.org/docs/latest/rules/quote-props
    'quote-props': ['error', 'consistent-as-needed'],
  },
}
