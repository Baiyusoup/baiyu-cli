module.exports = (promptAPI) => {
  promptAPI.injectFeature({
    name: 'Lint / Formatter',
    value: 'linter',
    checked: true,
  })

  promptAPI.injectPrompt({
    name: 'lintConfig',
    type: 'list',
    message: 'Pick a Lint / Formatter config:',
    when: (answers) => answers.features.includes('linter'),
    choices: [
      {
        name: 'Eslint + Prettier',
        value: 'eslint',
      },
      {
        name: 'Eslint + Stylelint + Prettier',
        value: 'stylelint',
      },
    ],
  })

  promptAPI.onPromptCompleteCb((answers, options) => {
    if (answers.features.includes('linter')) {
      options.plugins['@baiyusoup/cli-plugin-linter'] = {
        config: answers.lintConfig,
        template: answers.framework,
      }
    }
  })
}
