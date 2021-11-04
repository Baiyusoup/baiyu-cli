import { PRESET_PLUGIN_ID } from '../../utils/constants';
import type PromptAPI from '../PromptAPI';

export default function (api: PromptAPI) {
  api.injectFeature({
    name: 'Use template (default JS)',
    value: 'template',
  });

  api.injectPrompt({
    name: 'template',
    type: 'list',
    message: 'Pick a development language and template:',
    when: (answers) => answers.features.includes('template'),
    choices: [
      {
        name: 'Only JS',
        value: 'native',
      },
      {
        name: 'Only TS',
        value: 'typescript',
      },
      {
        name: 'React + JS',
        value: 'react',
      },
      {
        name: 'React + TS',
        value: 'typescript/react',
      },
      {
        name: 'Vue3 + JS',
        value: 'vue',
      },
      {
        name: 'Vue3 + TS',
        value: 'typescript/vue',
      },
      {
        name: 'Node + JS',
        value: 'node',
      },
      {
        name: 'Node + TS',
        value: 'typescript/node',
      },
    ],
  });

  api.onPromptCompleteCb((answers, options) => {
    // set @baiyusoup/templates plugin options
    const pluginOptions = {};
    if (answers.features.includes('template')) {
      pluginOptions['template'] = answers.template;
    } else {
      pluginOptions['template'] = 'native';
    }
    options.plugins[PRESET_PLUGIN_ID.templates] = pluginOptions;
    options.template = pluginOptions['template'];
  });
}
