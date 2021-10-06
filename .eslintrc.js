const __DEV__ = process.env.NODE_ENV !== 'production'

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'warn',
    'no-shadow': 'error',
    'no-unused-vars': 'warn',
    'no-debugger': __DEV__ ? 'off' : 'warn',
    'no-console': __DEV__ ? 'off' : 'warn',
    'require-yield': 'warn',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
  },
}
