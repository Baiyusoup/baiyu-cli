module.exports = (api, { config, template }, rootOptions) => {
  const eslint = require('./configs/eslint')
  const commitlint = require('./configs/commitlint')
  const prettier = require('./configs/prettier')
  const merge = require('lodash/merge')

  const exts = eslint.getExts(api, rootOptions.cssPreprocessor, template)

  const devDependencies = merge(
    {},
    eslint.getDeps(api, template),
    commitlint.getDeps(),
    prettier.getDeps()
  )

  const pkg = {
    scripts: {
      prepare: 'husky install',
      lint: 'npm run lint:eslint && npm run lint:prettier',
      'lint:eslint': `eslint --fix -c .eslintrc.js --ext ${exts.eslint.join()}`,
      'lint:prettier': `prettier --write "**/*.{${exts.prettier
        .map((ext) => ext.replace(/^\./, ''))
        .join(',')}}"`,
      'pre-commit:lint': 'lint-staged',
      'commit-msg:lint': 'commitlint --config commitlint.config.js -e',
      commit: 'cz',
    },
    eslintConfig: eslint.getConfig(api, template),
    commitlintConfig: commitlint.getConfig(),
    prettierConfig: prettier.getConfig(),
    devDependencies,
  }

  pkg['lint-staged'] = {
    [`*.{${exts.prettier.map((ext) => ext.replace(/^\./, '')).join(',')}}`]:
      'npm run lint',
  }

  if (config === 'stylelint') {
    const stylelint = require('./configs/stylelint')

    merge(pkg.devDependencies, stylelint.getDeps(rootOptions))
    pkg['stylelintConfig'] = stylelint.getConfig(rootOptions)

    pkg.scripts[
      'lint:stylelint'
    ] = `stylelint --fix --config stylelint.config.js **/*.{${exts.stylelint
      .map((ext) => ext.replace(/^\./, ''))
      .join(',')}}`

    pkg.scripts['lint'] =
      'npm run lint:eslint && npm run lint:stylelint && npm run lint:prettier'
  }

  api.render('./templates/eslint')
  api.render('./templates/commitlint')
  api.extendPackage(pkg)
}
