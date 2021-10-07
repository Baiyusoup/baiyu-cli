const { writeFileTree } = require('./utils/writeFileTree')
const ConfigTransform = require('./ConfigTransform')
const GeneratorAPI = require('./GeneratorAPI')
const normalizeFilePath = require('./utils/normalizeFilePaths')

const defaultConfigTransforms = {
  postcss: new ConfigTransform({
    file: {
      js: ['postcss.config.js'],
      json: ['.postcssrc.json', '.postcssrc'],
      yaml: ['.postcssrc.yaml', '.postcssrc.yml'],
    },
  }),
  eslintConfig: new ConfigTransform({
    file: {
      js: ['.eslintrc.js'],
      json: ['.eslintrc', '.eslintrc.json'],
      yaml: ['.eslintrc.yaml', '.eslintrc.yml'],
    },
  }),
  stylelintConfig: new ConfigTransform({
    file: {
      js: ['stylelint.config.js'],
    },
  }),
  commitlintConfig: new ConfigTransform({
    file: {
      js: ['commitlint.config.js'],
    },
  }),
  prettierConfig: new ConfigTransform({
    file: {
      js: ['prettier.config.js'],
    },
  }),
  jest: new ConfigTransform({
    file: {
      js: ['jest.config.js'],
    },
  }),
  'lint-staged': new ConfigTransform({
    file: {
      js: ['lint-staged.config.js'],
      json: ['.lintstagedrc', '.lintstagedrc.json'],
      yaml: ['.lintstagedrc.yaml', '.lintstagedrc.yml'],
    },
  }),
  _czrc: new ConfigTransform({
    file: {
      lines: ['.czrc'],
    },
  }),
  _eslintignore: new ConfigTransform({
    file: {
      lines: ['.eslintignore'],
    },
  }),
}

const reservedConfigTransforms = {
  vue: new ConfigTransform({
    file: {
      js: ['vite.config.js'],
    },
  }),
}

const watchFiles = (files, set) => {
  return new Proxy(files, {
    set(target, key, value, receiver) {
      set.add(key)
      return Reflect.set(target, key, value, receiver)
    },
    deleteProperty(target, key) {
      set.delete(key)
      return Reflect.deleteProperty(target, key)
    },
  })
}

// const isPlugin = (id) => id.includes('cli-plugin')

module.exports = class Generator {
  constructor(
    context,
    { pkg = {}, plugins = [], files = {}, invoking = false } = {}
  ) {
    this.context = context
    this.plugins = plugins
    this.originalPkg = pkg
    this.pkg = Object.assign({}, pkg)
    this.rootOptions = {}

    // 配置文件转换
    this.defaultConfigTransforms = defaultConfigTransforms
    this.reservedConfigTransforms = reservedConfigTransforms

    this.invoking = invoking
    this.depsSources = {}
    this.files = Object.keys(files).length
      ? watchFiles(files, (this.filesModifyRecord = new Set()))
      : files
    // 主要包含了ejs render函数，所有插件调用GeneratorAPI.render时，会将对应的渲染函数push到这里
    // 等所有插件都执行完后才会执行这里的渲染函数
    this.fileMiddlewares = []
    // 是所有普通文件在内存中渲染成字符串完成之后要执行的遍历回调
    // 主要是有些插件的功能是需要修改某些文件，因此需要等那些文件都渲染完后才能操作。
    this.postProcessFilesCbs = []

    // 拿到所有插件的generator
    // this.allPlugins = this.resolveAllPlugins()

    const cliService = plugins.find((p) => p.id === '@baiyusoup/cli-service')

    this.rootOptions = cliService.options
  }

  async generate({ checkExisting = false } = {}) {
    // 初始化插件，并调用插件的generator函数，将插件的配置信息放入pkg对象中保存
    await this.initPlugins()

    const initialFiles = Object.assign({}, this.files)

    // 从pkg对象中提取出配置到相应的文件中
    this.extractConfigFiles(checkExisting)

    await this.resolveFiles()

    this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n'

    // 创建文件
    await writeFileTree(
      this.context,
      this.files,
      initialFiles,
      this.filesModifyRecord
    )
  }

  async initPlugins() {
    const { rootOptions, invoking } = this
    const pluginIds = this.plugins.map((p) => p.id)

    // 调用所有插件的apply，收集afterAnyHooks

    // 重置hooks
    this.postProcessFileCbs = []

    // 调用plugin的generator
    for (const plugin of this.plugins) {
      // 插件名 插件的generator函数 配置
      const { id, apply, options } = plugin
      const api = new GeneratorAPI(id, this, options, rootOptions)
      await apply(api, options, rootOptions, invoking)

      if (apply.hooks) {
        await apply.hooks(api, options, rootOptions, pluginIds)
      }
    }
  }

  extractConfigFiles(checkExisting) {
    const configTransforms = Object.assign(
      {},
      defaultConfigTransforms,
      reservedConfigTransforms
    )
    const extract = (key) => {
      if (configTransforms[key] && this.pkg[key] && !this.originalPkg[key]) {
        const value = this.pkg[key]
        const configTransform = configTransforms[key]
        // 配置文件的内容
        const res = configTransform.transform(
          value,
          checkExisting,
          this.files,
          this.context
        )
        const { content, filename } = res
        this.files[filename] = content
        delete this.pkg[key]
      }
    }
    // 将所有非属于package.json属性的配置提取出来
    for (const key in this.pkg) {
      extract(key)
    }
  }

  async resolveFiles() {
    const files = this.files
    // 调用插件通过render api 创建的处理函数
    for (const middleware of this.fileMiddlewares) {
      await middleware(files)
    }

    // 格式化file path
    normalizeFilePath(files)

    for (const postProcess of this.postProcessFileCbs) {
      await postProcess(files)
    }
  }

  hasPlugin(id, versionRange) {
    const pluginExists = [...this.plugins.map((p) => p.id)].some((pid) =>
      pid.includes(id)
    )

    if (!pluginExists) {
      return false
    }

    if (!versionRange) {
      return pluginExists
    }
  }
}
