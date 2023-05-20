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
    // `isTrue === false`を許可する。
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',

    // https://eslint.org/docs/latest/rules/comma-dangle
    'comma-dangle': ['error', {
      arrays: 'ignore',
      objects: 'ignore',
      imports: 'ignore',
      exports: 'ignore',
      functions: 'ignore',
    }], // TODO: enable(always-multiline)

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

    // https://eslint.org/docs/latest/rules/no-unused-vars
    'no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_' }],
  },
}
