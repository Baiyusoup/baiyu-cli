const deps = {
  react: {
    react: '^17.0.0',
    'react-dom': '^17.0.0',
  },
  vue: {
    vue: '^3.2.13',
  },
};

/**
 * @param {PluginAPI} api
 * @param {*} options
 */
module.exports = function (api, options, rootOptions) {
  const langAndTemplate = options.template.split('/');
  const hasTypescript = langAndTemplate[0] === 'typescript';
  const template = langAndTemplate.length > 1 ? langAndTemplate[1] : langAndTemplate[0];
  const templateDir = `${template}${langAndTemplate.length > 1 ? '-ts' : ''}`;

  const scripts = {};
  const devDependencies = {};
  const dependencies = {};

  if (hasTypescript) {
    devDependencies['typescript'] = '^4.4.4';
  }

  if (template !== 'node') {
    // vite script
    Object.assign(scripts, {
      dev: 'vite',
      build: 'vite build',
      serve: 'vite preview',
    });

    // vite 依赖
    dependencies['vite'] = '^2.5.10';

    // CSS预处理器依赖
    if (rootOptions.preprocessor) {
      Object.assign(devDependencies, {
        sass: '^1.32.7',
      });
    }

    // react/vue依赖
    Object.assign(dependencies, deps[template] || {});

    // react/vue的vite插件依赖
    if (template === 'react') {
      devDependencies['@vitejs/plugin-react'] = '^1.0.0';
    } else if (template === 'vue') {
      devDependencies['@vitejs/plugin-vue'] = '^1.9.0';
    }

    // react/vue ts依赖
    if (hasTypescript) {
      scripts['build'] = 'tsc && vite build';

      if (template === 'react') {
        Object.assign(devDependencies, {
          '@types/react': '^17.0.0',
          '@types/react-dom': '^17.0.0',
        });
      } else if (template === 'vue') {
        devDependencies['vue-tsc'] = '^0.3.0';
      }
    }
  } else if (hasTypescript) {
    scripts['build'] = 'tsc';
  }

  // 读取模板
  api.render(`./templates/${templateDir}`, { projectName: rootOptions.projectName });
  api.extendPackage({
    scripts,
    dependencies,
    devDependencies,
  });
};
