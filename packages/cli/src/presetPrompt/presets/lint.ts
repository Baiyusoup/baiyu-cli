import { PRESET_PLUGIN_ID } from '../../utils/constants'
import type PromptAPI from '../PromptAPI'

export default function (api: PromptAPI) {
  api.injectFeature({
    name: '使用规范工具',
    value: 'linter'
  })

  api.injectPrompt({
    name: 'lintConfig',
    type: 'checkbox',
    message: '选择规范工具：',
    when: (answers) => answers.features.includes('css'),
    choices: [
      {
        name: 'Eslint + Prettier',
        value: 'eslint',
        checked: true
      },
      {
        name: 'Stylelint',
        value: 'stylelint'
      },
      {
        name: 'Markdownlint',
        value: 'markdown'
      }
    ]
  })

  api.onPromptCompleteCb((answers, options) => {
    if (answers.features.includes('linter')) {
      options.plugins[PRESET_PLUGIN_ID.lint] = {
        config: answers.lintConfig,
        template: answers.template
      }
    }
  })
}
