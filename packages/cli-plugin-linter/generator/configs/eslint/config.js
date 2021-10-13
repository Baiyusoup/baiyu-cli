const merge = require('lodash/merge')
const deepClone = require('lodash/cloneDeep')
const baseConfig = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:import/recommended', // eslint-plugin-import
  ],
  rules: {
    'prettier/prettier': 'warn',
    'no-shadow': 'error',
    'no-unused-vars': 'warn',
    'require-yield': 'warn', // 不允许 generate 函数中没有 yield
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
  },
}

const baseTypescriptConfig = {
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/extensions': ['.tsx', '.ts', '.js', '.jsx', '.json'],
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
  },
  // ts 规则单独覆盖
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      // 只针对 ts 用 typescript-eslint
      parser: '@typescript-eslint/parser',
      // 开启静态检查
      parserOptions: {
        tsconfigRootDir: '__dirname',
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

const reactConfig = {
  base: {
    settings: {
      react: {
        version: 'detect',
      },
    },
    parserOptions: {
      ecmaVersion: 2021,
      ecmaFeatures: {
        jsx: true,
      },
    },
    extends: [
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
    ],
    rules: {
      // react
      'react/self-closing-comp': 'error',
      // click element muse have keyboard events
      'jsx-a11y/click-events-have-key-events': 'off',
      // click element must have a role property
      'jsx-a11y/no-static-element-interactions': 'off',
    },
  },
}

const vueConfig = {
  base: {
    extends: [
      'plugin:vue/vue3-essential',
      'plugin:vue/vue3-strongly-recommended',
      'plugin:vue/vue3-recommended',
    ],
    settings: {
      vue: {
        version: 'detect',
      },
    },
  },
  typescript: {
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
}

const templateConfig = (template) =>
  template === 'vue' ? vueConfig.base : reactConfig.base

exports.getConfig = (api, template) => {
  const config = deepClone(baseConfig)
  if (template) {
    merge(config, templateConfig(template))

    // 对于数组，会直接覆盖，而不是合并
    config.extends.unshift(...baseConfig.extends)
  }

  if (api.hasPlugin('jest')) {
    config.env['jest'] = true
  }

  if (api.hasPlugin('typescript')) {
    merge(config, baseTypescriptConfig)
    config.extends.push('plugin:import/typescript')

    if (template && template === 'vue') {
      merge(config, vueConfig.typescript)
      config.extends.push('plugin:@typescript-eslint/recommended')
    }
  }

  // 保证plugin:prettier/recommended是最后一个
  config.extends.push('plugin:prettier/recommended')
  return config
}

exports.getExts = (api, cssPreprocessor, template) => {
  const prettier = new Set(['.md', '.json', '.yml'])
  const eslint = ['.js']
  const stylelint = ['.css']

  const tsFlag = api.hasPlugin('typescript')

  if (cssPreprocessor) {
    let processor = '.scss'
    if (cssPreprocessor === 'less') {
      processor = '.less'
    } else if (cssPreprocessor === 'stylus') {
      processor = '.stylus'
    }
    stylelint.push(processor)
  }

  if (tsFlag) {
    eslint.push('.ts')
  }

  if (template) {
    if (tsFlag) {
      eslint.push('.tsx')
    } else {
      eslint.push('.jsx')
    }
    if (template === 'vue') {
      eslint.push('.vue')
      stylelint.push('.vue')
    }
  }
  ;[...eslint, ...stylelint].forEach((ext) => prettier.add(ext))
  return {
    prettier: Array.from(prettier),
    eslint,
    stylelint,
  }
}
