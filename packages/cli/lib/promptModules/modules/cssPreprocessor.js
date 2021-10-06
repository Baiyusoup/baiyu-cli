module.exports = (promptAPI) => {
  promptAPI.injectFeature({
    name: 'CSS Pre-processor',
    value: 'css-preprocessor',
  })

  promptAPI.injectPrompt({
    name: 'cssPreprocessor',
    type: 'list',
    message: 'Pick a CSS Pre-processor:',
    when: (answers) => answers.features.includes('css-preprocessor'),
    choices: [
      {
        name: 'Dart Sass',
        value: 'dart-sass',
      },
      {
        name: 'Less',
        value: 'less',
      },
      {
        name: 'Stylus',
        value: 'stylus',
      },
    ],
  })

  promptAPI.onPromptCompleteCb((answers, options) => {
    if (answers.cssPreprocessor) {
      options.cssPreprocessor = answers.cssPreprocessor
    }
  })
}
