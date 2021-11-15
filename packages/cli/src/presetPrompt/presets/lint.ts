import { PRESET_PLUGIN_ID } from '../../utils/constants';
import type PromptAPI from '../PromptAPI';

export default function (api: PromptAPI) {
  api.injectFeature({
    name: 'Use linter and formatter',
    value: 'linter',
    checked: true,
  });

  api.injectPrompt({
    name: 'lintConfig',
    type: 'checkbox',
    message: 'Pick a linter and formatter config:',
    when: (answers) => answers.features.includes('linter'),
    choices: [
      {
        name: 'Eslint + Prettier',
        value: 'eslint',
        checked: true,
      },
      {
        name: 'Commitlint',
        value: 'commitlint',
      },
      {
        name: 'Stylelint',
        value: 'stylelint',
      },
      {
        name: 'Markdownlint',
        value: 'markdownlint',
      },
    ],
  });

  api.onPromptCompleteCb((answers, options) => {
    if (answers.features.includes('linter')) {
      options.plugins[PRESET_PLUGIN_ID.lint] = {
        config: answers.lintConfig,
      };
    }
  });
}
