import type PromptAPI from '../PromptAPI'

export default function (api: PromptAPI) {
  api.injectFeature({
    name: '使用样式文件',
    value: 'style'
  })

  api.injectPrompt({
    name: 'preprocess',
    type: 'confirm',
    message: '是否使用CSS预处理器？',
    when: (answers) => answers.features.includes('style')
  })

  api.onPromptCompleteCb((answers, options) => {
    if (answers.features.includes('style')) {
      options.css = true
      options.preprocessor = answers.preprocessor
    } else {
      options.css = false
    }
  })
}
