/**
 * @param {{extendPackage: Function, render: Function, resolve: Function}} api
 * @param {{config: string[] }} options
 * @param {{template: string, css: boolean, preprocessor: boolean}} rootOptions
 */
module.exports = function (api, options, rootOptions) {
  const eslintExt = ['.js'];
  const stylelintFiles = ['css'];

  const langAndTemplate = rootOptions.template.split('/');
  const hasTypescript = langAndTemplate[0] === 'typescript';
  const template = langAndTemplate.length > 1 ? langAndTemplate[1] : langAndTemplate[0];

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
    eslintExt.push('.tsx');
  }

  // 处理stylelint文件后缀
  // 如果用户使用规范工具有stylelint，也选择使用样式文件 -> 使用stylelint
  const hasStylelint = options.config.includes('stylelint');
  if (hasStylelint && rootOptions.css) {
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

  if (!(hasStylelint && rootOptions.css)) {
    scripts['lint'] = 'npm run lint:eslint';
    delete scripts['lint:stylelint'];
  }

  api.extendPackage({
    scripts,
  });

  // lint 模板
  // 必要模板
  const eslintRenderConfig = {
    eslintType: rootOptions.template,
  };
  api.render('./config/eslint', eslintRenderConfig);

  const editorRenderConfig = {
    enableStylelint: hasStylelint && rootOptions.css,
    stylelintExt: stylelintFiles,
  };
  api.render('./config/editor', editorRenderConfig);

  const commitRenderConfig = {
    exts: `${eslintExt.map((ext) => ext.replace(/^\./, '')).join()},${stylelintFiles.join()}`,
  };
  api.render('./config/commit', commitRenderConfig);

  // 使用stylelint模板
  if (hasStylelint && rootOptions.css) {
    api.render('./config/stylelint');
  }
};
