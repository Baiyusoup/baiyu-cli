const tsEslintConfig = {
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      // 只针对 ts 用 typescript-eslint
      parser: '@typescript-eslint/parser',
      // 开启静态检查
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json'],
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        // close js rules
        'no-shadow': 'off',
        // ts
        '@typescript-eslint/no-var-requires': 'warn',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        // no any
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        // ! operator
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
}
exports.config = (api, preset) => {
  const config = {
    root: true,
    env: {
      node: true,
      browser: true,
      es2021: true,
    },
    extends: ['plugin:eslint-comments/recommended'],
    parserOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      'no-console': makeJSOnlyValue(
        `process.env.NODE_ENV === 'production' ? 'warn' : 'off'`
      ),
      'no-debugger': makeJSOnlyValue(
        `process.env.NODE_ENV === 'production' ? 'warn' : 'off'`
      ),
    },
  }

  if (preset === 'prettier') {
    config.extends.push(
      ...['eslint:recommended', 'plugin:prettier/recommended']
    )
  } else {
    // default
    config.extends.push('eslint:recommended')
  }

  if (api.hasPlugin('jest')) {
    config.env['jest'] = true
    config.extends.push('eslint-plugin-jest')
  }

  if (api.hasPlugin('typescript')) {
    Object.assign(config, tsEslintConfig)
  }
  return config
}

// __expression is a special flag that allows us to customize stringification
// output when extracting configs into standalone files
function makeJSOnlyValue(str) {
  const fn = () => {}
  fn.__expression = str
  return fn
}

const baseExtensions = ['.js', '.jsx', '.vue']
exports.extensions = (api) =>
  api.hasPlugin('typescript')
    ? baseExtensions.concat('.ts', '.tsx')
    : baseExtensions
