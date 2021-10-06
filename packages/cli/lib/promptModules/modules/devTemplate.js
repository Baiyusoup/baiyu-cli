module.exports = (promptAPI) => {
  promptAPI.injectFeature({
    name: 'Development Template',
    value: 'framework',
  })
  promptAPI.injectPrompt({
    name: 'framework',
    type: 'list',
    message: 'Pick a development template:',
    when: (answers) => answers.features.includes('framework'),
    choices: [
      {
        name: 'Vue (vue3)',
        value: 'vue',
      },
      {
        name: 'React',
        value: 'react',
      },
    ],
  })

  promptAPI.onPromptCompleteCb((answers, options) => {
    if (answers.features.includes('framework')) {
      options.template = answers.framework
    }
  })
}
