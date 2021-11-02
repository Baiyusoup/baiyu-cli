/**
 * @param {{extendPackage: Function, render: Function, resolve: Function}} api
 * @param {{config: string[], template: string, css: boolean, preprocessor: boolean }} options
 */
module.exports = function (api, options) {
  const eslintExt = ['.js'];
  const stylelintFiles = ['css'];

  const langAndTemplate = options.template.split('/');
  const hasTypescript = langAndTemplate[0] === 'typescript';
  const template = hasTypescript > 0 ? langAndTemplate[0] : langAndTemplate[1];

  // eslint 文件后缀
  if (hasTypescript) {
    eslintExt.push('.ts');
  }

  let isFrame = false;
  if (template === 'react') {
    eslintExt.push('.jsx');
    isFrame = true;
  } else if (template === 'vue') {
    eslintExt.push('.jsx', '.vue');
    isFrame = true;
  }

  if (isFrame && hasTypescript) {
    eslintExt.push('.jsx');
  }

  // 处理stylelint文件后缀
  // 如果用户使用规范工具有stylelint，也选择使用样式文件 -> 使用stylelint
  const hasStylelint = options.config.includes('stylelint');
  if (hasStylelint && options.css) {
    stylelintFiles.push('scss', 'less');
    if (template === 'vue') {
      stylelintFiles.push('vue');
    }
  }

  // lint script 命令
  const scripts = {
    prepare: 'bash prepare.sh',
    lint: 'npm run lint:eslint && npm run lint:stylelint',
    'lint:eslint': `eslint --fix --ext ${eslintExt.join(',')}`,
    'lint:stylelint': `stylelint -fix **/*.{${stylelintFiles.join(',')}}`,
    'lint:commit': 'commitlint --g commitlint.config.js -e',
    commit: 'cz',
  };

  if (hasStylelint && options.css) {
    scripts['lint'] = 'npm run lint:eslint';
    delete scripts['lint:stylelint'];
  }

  api.extendPackage({
    scripts,
  });

  // lint 模板
  // 必要模板
  const eslintRenderConfig = {
    eslintType: options.template,
  };
  api.render('./config/eslint', eslintRenderConfig);

  const editorRenderConfig = {
    enableStylelint: hasStylelint && options.css,
    stylelintExt: stylelintFiles,
  };
  api.render('./config/editor', editorRenderConfig);

  const commitRenderConfig = {
    exts: `${eslintExt.map((ext) => ext.replace(/^\./, '')).join()},${stylelintFiles.join()}`,
  };
  api.render('./config/commit', commitRenderConfig);

  // 使用stylelint模板
  if (hasStylelint && options.css) {
    api.render('./config/stylelint');
  }
};
