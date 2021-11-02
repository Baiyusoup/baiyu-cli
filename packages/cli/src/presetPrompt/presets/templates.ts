import type PromptAPI from '../PromptAPI';

export default function (api: PromptAPI) {
  api.injectFeature({
    name: '是否需要模板（默认原生JS开发）？',
    value: 'dev',
  });

  api.injectPrompt({
    name: 'template',
    type: 'list',
    message: '选择项目的语言（JS/TS）和框架（React/Vue）类型',
    when: (answer) => answer.features.includes('dev'),
    choices: [
      {
        name: '原生JS开发',
        value: 'native',
      },
      {
        name: '原生TS开发',
        value: 'typescript',
      },
      {
        name: 'React项目（Javascript）',
        value: 'react',
      },
      {
        name: 'React项目（Typescript）',
        value: 'typescript/react',
      },
      {
        name: 'Vue3项目（Javascript）',
        value: 'vue',
      },
      {
        name: 'Vue3项目（Typescript）',
        value: 'typescript/vue',
      },
      {
        name: 'Node项目（Javascript）',
        value: 'node',
      },
      {
        name: 'Node项目（Typescript）',
        value: 'typescript/node',
      },
    ],
  });

  api.onPromptCompleteCb((answers, options) => {
    if (answers.features.includes('template')) {
      options.template = answers.template;
    } else {
      options.template = 'native';
    }
    options.preprocessor = answers.preprocessor;
  });
}
