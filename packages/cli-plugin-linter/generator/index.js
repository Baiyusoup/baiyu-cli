module.exports = (api, { config, template }, rootOptions) => {
  const eslintConfig = require('./config/eslint/options').config(api, template)
  const eslintDeps = require('./config/eslint/deps').getDeps(api, template)
  const commitlintDeps = require('./config/commitlint/deps').getDeps()
  const commitlintConfig = require('./config/commitlint/options').config()
  const prettierConfig = require('./config/prettier/options').config()

  const exts = require('./config/eslint/options').getExts(
    api,
    rootOptions.cssPreprocessor,
    template
  )

  const devDependencies = Object.assign({}, eslintDeps, commitlintDeps, {
    'lint-staged': '^11.2.0',
    husky: '^7.0.2',
    prettier: '^2.4.1',
  })

  const pkg = {
    scripts: {
      lint: 'npm run lint:eslint && npm run lint:prettier',
      'lint:eslint': `eslint --fix -c .eslintrc.js --ext ${exts.eslint.join()}`,
      'lint:prettier': `prettier --write "**/*.{${exts.prettier
        .map((ext) => ext.replace(/^\./, ''))
        .join(',')}}"`,
      'pre-commit:lint': 'lint-staged',
      'commit-msg:lint': 'commitlint --config commitlint.config.js -e',
      commit: 'cz',
    },
    eslintConfig,
    commitlintConfig,
    prettierConfig,
    devDependencies,
  }

  pkg['lint-staged'] = {
    [`*.{${exts.prettier.map((ext) => ext.replace(/^\./, '')).join(',')}}`]:
      'npm run lint',
  }

  api.render('./config/eslint/templates')
  api.render('./config/commitlint/templates')

  if (config === 'stylelint') {
    const stylelintDeps = require('./config/stylelint/deps').getDeps()
    const stylelintConfig = require('./config/stylelint/options').getConfig()

    Object.assign(pkg.devDependencies, stylelintDeps)
    pkg['stylelintConfig'] = stylelintConfig

    pkg.scripts[
      'lint:stylelint'
    ] = `stylelint --fix --config stylelint.config.js **/*.{${exts.stylelint
      .map((ext) => ext.replace(/^\./, ''))
      .join(',')}}`

    pkg.scripts['lint'] =
      'npm run lint:eslint && npm run lint:stylelint && npm run lint:prettier'
  }

  api.extendPackage(pkg)
}
