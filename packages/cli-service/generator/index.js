module.exports = (api, options) => {
  if (options.configs) {
    api.extendPackage(options.configs)
  }

  api.render('./templates/native')
  api.extendPackage({
    scripts: {
      dev: 'vite',
      build: 'vite build',
      serve: 'vite preview',
    },
    devDependencies: {
      vite: '^2.5.10',
    },
  })
  // 原生开发，不使用框架
  if (!options.template) return

  const pkg = {}
  const frameworkDeps = require(`./${options.template}Deps`).getDeps(api)

  Object.assign(pkg, frameworkDeps)

  const templateName = `${options.template}${
    api.hasPlugin('typescript') ? '-ts' : ''
  }`

  api.render(`./templates/${templateName}`)

  if (options.cssPreprocessor) {
    const deps = {
      'dart-sass': {
        sass: '^1.32.7',
      },
      less: {
        less: '^4.0.0',
      },
      stylus: {
        stylus: '^0.54.8',
      },
    }
    Object.assign(pkg, {
      devDependencies: deps[options.cssPreprocessor],
    })
  }

  api.extendPackage(pkg)

  // 删除原生开发的main.js，框架模板对于vite有自身的入口文件
  if (options.template !== 'vue') {
    api.postProcessFiles((files) => {
      delete files['src/main.js']
    })
  }
}
