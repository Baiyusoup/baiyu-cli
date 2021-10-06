const EventEmitter = require('events')
const execa = require('execa')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { loadModule } = require('@vue/cli-shared-utils')
const sortObject = require('./utils/sortObject')
const PromptModuleAPI = require('./promptModules/PromptModuleAPI')
const { writeFileTree } = require('./utils/writeFileTree')
const Generator = require('./Generator')

class Creator extends EventEmitter {
  constructor(name, context, promptModules) {
    super()
    this.name = name
    this.context = context

    const { featurePrompt } = this.resolveIntroPrompt()

    this.featurePrompt = featurePrompt
    this.injectPrompt = []
    this.promptCompleteCbs = []
    this.run = this.run.bind(this)
    const promptAPI = new PromptModuleAPI(this)
    promptModules.forEach((m) => m(promptAPI))
  }

  resolveIntroPrompt() {
    const featurePrompt = {
      name: 'features',
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [],
    }
    return {
      featurePrompt,
    }
  }

  run(command, args) {
    return execa(command, args, { cwd: this.context })
  }

  async create() {
    const { run, name, context } = this
    let preset = await this.promptAndResolvePreset()

    preset.plugins['@baiyu/cli-service'] = Object.assign(
      {
        projectName: name,
      },
      preset
    )

    // TODO 根据本地情况选择npm还是yarn
    const packageManger = 'npm'

    console.log(`✨  Creating project in ${chalk.yellow(context)}.`)
    this.emit('creation', { event: 'creating' })

    // package.json
    const pkg = {
      name,
      version: '1.0.0',
      private: true,
      devDependencies: {},
    }

    const deps = Object.keys(preset.plugins)
    deps.forEach((dep) => {
      let { version } = preset.plugins[dep]
      if (!version) {
        // TODO 获取插件的版本
        version = '^0.1.0'
      }
      pkg.devDependencies[dep] = version
    })

    await writeFileTree(context, {
      'package.json': JSON.stringify(pkg, null, 2),
    })

    console.log(`🗃  Initializing git repository...`)
    this.emit('creation', { event: 'git-init' })
    await run('git', ['init'])

    console.log(`⚙\u{fe0f}  Installing CLI plugins. This might take a while...`)
    console.log()
    this.emit('creation', { event: 'plugins-install' })

    await run(packageManger, ['install'], { cwd: context })

    console.log(`🚀  Invoking generators...`)
    this.emit('creation', { event: 'invoking-generators' })
    // 拿到已经安装的插件的generator
    const plugins = await this.resolvePlugins(preset.plugins, pkg)
    const generator = new Generator(context, {
      pkg,
      plugins,
    })
    // 将会调用所有插件的generator
    await generator.generate()

    console.log(`📦  Installing additional dependencies...`)
    this.emit('creation', { event: 'deps-install' })
    console.log()

    await run(packageManger, ['install'], { cwd: context })

    console.log()
    console.log(`🎉  Successfully created project ${chalk.yellow(name)}.`)
    console.log()
    this.emit('creation', { event: 'done' })
  }

  async resolvePlugins(rawPlugins, pkg) {
    // 保证@baiyu/cli-service 第一个被解析
    rawPlugins = sortObject(rawPlugins, ['@baiyu/cli-service'], true)
    const plugins = []
    for (const id of Object.keys(rawPlugins)) {
      const apply = loadModule(`${id}/generator`, this.context) || (() => {})
      let options = rawPlugins[id] || {}

      if (options.prompt) {
        let pluginPrompts = loadModule(`${id}/prompts`, this.context)

        if (pluginPrompts) {
          const prompt = inquirer.createPromptModule()
          if (typeof pluginPrompts === 'function') {
            pluginPrompts = pluginPrompts(pkg, prompt)
          }
          if (typeof pluginPrompts === 'function') {
            pluginPrompts = pluginPrompts.getPrompt(pkg, prompt)
          }

          console.log(
            `\n${chalk.cyan(options._isPreset ? `Preset options:` : id)}`
          )
          options = await prompt(pluginPrompts)
        }
      }
      plugins.push({ id, apply, options })
    }
    return plugins
  }

  async promptAndResolvePreset() {
    const answers = await inquirer.prompt(this.resolveFinalPrompt())
    const preset = {
      plugins: {},
    }
    answers.features = answers.features || []
    this.promptCompleteCbs.forEach((cb) => cb(answers, preset))

    return preset
  }

  resolveFinalPrompt() {
    return [this.featurePrompt, ...this.injectPrompt]
  }
}

module.exports = Creator
