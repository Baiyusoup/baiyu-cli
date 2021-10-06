class PromptModuleAPI {
  constructor(creator) {
    this.creator = creator
  }

  injectFeature(feature) {
    this.creator.featurePrompt.choices.push(feature)
  }

  injectPrompt(prompt) {
    this.creator.injectPrompt.push(prompt)
  }

  onPromptCompleteCb(cb) {
    this.creator.promptCompleteCbs.push(cb)
  }
}

module.exports = PromptModuleAPI
