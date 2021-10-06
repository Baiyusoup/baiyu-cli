function getVueDeps(hasTs) {
  const deps = {
    dependencies: {
      vue: '^3.2.13',
    },
    devDependencies: {
      '@vitejs/plugin-vue': '^1.9.0',
    },
  }
  if (hasTs) {
    deps.devDependencies['vue-tsc'] = '^0.3.0'
  }
  return deps
}

function getReactDeps(hasTs) {
  const deps = {
    dependencies: {
      react: '^17.0.0',
      'react-dom': '^17.0.0',
    },
    devDependencies: {
      '@vitejs/plugin-react': '^1.0.0',
    },
  }
  if (hasTs) {
    Object.assign(deps.devDependencies, {
      '@types/react': '^17.0.0',
      '@types/react-dom': '^17.0.0',
    })
  }

  return deps
}

const frameworkDeps = {
  vue: getVueDeps,
  react: getReactDeps,
}

module.exports = (api, options) => {
  if (options.configs) {
    api.extendPackage(options.configs)
  }
  // 原生开发，不使用框架和vite
  if (!options.template) return
  const pkg = {
    scripts: {
      dev: 'vite',
      build: 'vite build',
      serve: 'vite preview',
    },
    devDependencies: {
      vite: '^2.5.10',
    },
  }
  const templateName = `${options.template}${
    api.hasPlugin('typescript') ? '-ts' : ''
  }`

  api.render(`./templates/${templateName}`)

  Object.assign(
    pkg,
    frameworkDeps[options.template](api.hasPlugin('typescript'))
  )

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
}
