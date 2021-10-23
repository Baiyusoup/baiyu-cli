const merge = require('lodash/merge')

module.exports = (api, options) => {
  if (options.configs) {
    api.extendPackage(options.configs)
  }
  const template = options.template ? options.template : 'native'
  const templateName = `${template}${api.hasPlugin('typescript') ? '-ts' : ''}`

  const pkg = require(`./nativePkg`).getPkg()
  if (template !== 'native') {
    merge(pkg, require(`./${template}Deps`).getDeps(api))
    // Object.assign(pkg, require(`./${template}Deps`).getDeps(api))
  }

  if (options.cssPreprocessor) {
    const deps = {
      sass: {
        sass: '^1.32.7',
      },
      less: {
        less: '^4.0.0',
      },
    }

    merge(pkg, {
      devDependencies: deps[options.cssPreprocessor],
    })
  }

  api.render(`./templates/${templateName}`)
  api.extendPackage(pkg)
}
