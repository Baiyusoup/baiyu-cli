/**
 * @param {{extendPackage: Function, render: Function, resolve: Function}} api
 * @param {{config: string[] }} options
 * @param {{template: string, css: boolean, preprocessor: boolean}} rootOptions
 */
module.exports = function (api, options, rootOptions) {
  const eslintExt = ['.js'];
  const stylelintFiles = [];

  const langAndTemplate = rootOptions.template.split('/');
  const hasTypescript = langAndTemplate[0] === 'typescript';
  const template = langAndTemplate.length > 1 ? langAndTemplate[1] : langAndTemplate[0];

  // eslint 文件后缀
  if (hasTypescript) {
    eslintExt.push('.ts');
  }

  // 如果为false，则表明不需要CSS文件，那么lint-staged也不需要检测样式文件
  if (rootOptions.css) {
    stylelintFiles.push('css');
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
    stylelintFiles.push('scss');
    if (template === 'vue') {
      stylelintFiles.push('vue');
    }
  }

  // lint script 命令
  const lintedFileExts = [...eslintExt.map((ext) => ext.replace(/^\./, '')), ...stylelintFiles];
  const scripts = {
    lint: 'npm run eslint && npm run lint:style',
    eslint: `eslint --fix --ext ${eslintExt.join(',')}`,
    'lint:style': `stylelint --fix **/*.{${stylelintFiles.join(',')}}`,
    'lint:commit': 'commitlint --g commitlint.config.js -e',
    format: `prettier --write`,
    commit: 'cz',
  };

  if (!(hasStylelint && rootOptions.css)) {
    scripts['lint'] = scripts['eslint'];
    delete scripts['eslint'];
    delete scripts['stylelint'];
  }

  const devDependencies = {
    eslint: '^8.2.0',
    prettier: '^2.4.1',
    'eslint-config-prettier': '^8.3.0',
  };

  if (options.config.includes('commitlint')) {
    scripts['prepare'] = 'bash prepare.sh';
    Object.assign(devDependencies, {
      '@commitlint/cli': '^13.2.0',
      '@commitlint/config-angular': '^14.1.0',
      commitizen: '^4.2.4',
      'conventional-changelog-cli': '^2.1.1',
      husky: '^7.0.2',
      'lint-staged': '^11.2.0',
    });
  }

  if (isFrame) {
    devDependencies['@antfu/eslint-config'] = '^0.10.0';
  } else if (hasTypescript) {
    devDependencies['@antfu/eslint-config-ts'] = '^0.10.0';
  } else {
    // node/native template
    devDependencies['@antfu/eslint-config-basic'] = '^0.10.0';
  }

  api.extendPackage({
    scripts,
    devDependencies,
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

  if (options.config.includes('commitlint')) {
    const commitRenderConfig = {
      exts: `${lintedFileExts.join()}`,
    };
    api.render('./config/commit', commitRenderConfig);
  }

  // 使用stylelint模板
  if (hasStylelint && rootOptions.css) {
    api.render('./config/stylelint');
  }
};
