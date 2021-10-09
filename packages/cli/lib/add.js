const { resolveModule, resolvePluginId } = require('@vue/cli-shared-utils')
const execa = require('execa')
const chalk = require('chalk')
const invoke = require('./invoke')

async function add(pluginToAdd, context = process.cwd()) {
  console.log(pluginToAdd)
  // 需要检查

  const pluginRe = /^(@?[^@]+)(?:@(.+))?$/
  // eslint-disable-next-line no-unused-vars
  const [_skip, pluginName, pluginVersion] = pluginToAdd.match(pluginRe)

  const packageName = resolvePluginId(pluginName)
  console.log()
  console.log(`📦  Installing ${chalk.cyan(packageName)}...`)
  console.log()

  await execa('npm', ['install', packageName, pluginVersion])

  console.log(
    `${chalk.green('✔')}  Successfully installed plugin: ${chalk.cyan(
      packageName
    )}`
  )
  console.log()

  const generatorPath = resolveModule(`${packageName}/generator`, context)
  if (generatorPath) {
    invoke(pluginName, context)
  } else {
    console.log(`Plugin ${packageName} does not have a generator to invoke`)
  }
}
module.exports = (...args) => {
  return add(...args).catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
