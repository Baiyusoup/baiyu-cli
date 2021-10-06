module.exports = (promptAPI) => {
  promptAPI.injectFeature({
    name: 'Unit Testing',
    value: 'unit',
  })

  promptAPI.injectPrompt({
    name: 'unit',
    type: 'list',
    message: 'Pick a unit testing solution:',
    when: (answers) => answers.features.includes('unit'),
    choices: [
      {
        name: 'Jest',
        value: 'jest',
        short: 'Jest',
      },
      {
        name: 'Mocha + Chai',
        value: 'mocha',
        short: 'Mocha',
      },
    ],
  })

  promptAPI.onPromptCompleteCb((answers, options) => {
    if (answers.features.includes('jest')) {
      options.plugins['@baiyu/cli-plugin-jest'] = {}
    } else if (answers.features.includes('mocha')) {
      options.plugins['@baiyu/cli-plugin-mocha'] = {}
    }
  })
}
