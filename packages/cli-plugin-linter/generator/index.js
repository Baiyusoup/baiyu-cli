module.exports = (api, { config, template }, rootOptions) => {
  const eslintConfig = require('./config/eslint/options').config(api, template)
  const eslintDeps = require('./config/eslint/deps').getDeps(api, template)
  const commitlintDeps = require('./config/commitlint/deps').getDeps()
  const commitlintConfig = require('./config/commitlint/options').config()
  const prettierConfig = require('./config/prettier/options').config()

  const devDependencies = Object.assign({}, eslintDeps, commitlintDeps, {
    'lint-staged': '^11.2.0',
    prettier: '^2.4.1',
  })

  const pkg = {
    scripts: {
      lint: 'npm run lint:eslint && npm run lint:prettier',
      'lint:eslint': 'eslint --fix -c .eslintrc.js --ext .js, .',
      'lint:prettier': 'prettier --write "**/*.{js,json,md}"',
      'pre-commit:lint': 'lint-staged',
      'commit-msg:lint': 'commitlint --config commitlint.config.js -e',
      commit: 'cz',
    },
    gitHooks: {
      'pre-commit': 'npm run pre-commit:lint',
      'commit-msg': 'npm run commit-mgs:lint',
    },
    eslintConfig,
    commitlintConfig,
    prettierConfig,
    devDependencies,
  }

  const extensions = require('./config/eslint/options')
    .extensions(api)
    .map((ext) => ext.replace(/^\./, ''))
  pkg['lint-staged'] = {
    [`*.{${extensions.join(',')}}`]: 'npm run lint',
  }

  api.render('./config/eslint/template')
  api.render('./config/commitlint/template')

  if (config === 'stylelint') {
    const stylelintDeps = require('./config/stylelint/deps').getDeps()
    const stylelintConfig = require('./config/stylelint/options').getConfig()

    Object.assign(pkg.devDependencies, stylelintDeps)
    pkg['stylelintConfig'] = stylelintConfig

    pkg.scripts[
      'lint:stylelint'
    ] = `stylelint --fix --config stylelint.config.js **/*.{css${
      ', ' + rootOptions.cssPreprocessor
    }}`
    const oldLintScript = pkg.scripts['lint']
    pkg.scripts['lint'] = 'npm run lint:style && ' + oldLintScript

    pkg.scripts[
      'lint:prettier'
    ] = `prettier --write "**/*.{js,json,md,css,${rootOptions.cssPreprocessor}}"`
  }

  api.extendPackage(pkg)
}

module.exports.applyTS = (api) => {
  api.extendPackage({
    eslintConfig: {
      extends: ['@vue/typescript'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    devDependencies: require('./config/eslint/deps').DEPS_MAP.typescript,
  })
}
