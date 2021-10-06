module.exports = (promptAPI) => {
  promptAPI.injectFeature({
    name: 'Typescript',
    value: 'ts',
  })

  promptAPI.onPromptCompleteCb((answers, options) => {
    if (answers.features.includes('ts')) {
      options.plugins['@baiyu/cli-plugin-typescript'] = {}
    }
  })
}
