const {
  chalk,

  log,
  error,
  logWithSpinner,
  stopSpinner,

  resolvePluginId,

  loadModule,
} = require('@vue/cli-shared-utils')
const execa = require('execa')
const Generator = require('./Generator')
const readFiles = require('./utils/readFiles')

async function invoke(pluginName, context = process.cwd()) {
  console.log(pluginName)

  const pkg = require(`${context}/package.json`)
  // attempt to locate the plugin in package.json
  const findPlugin = (deps) => {
    if (!deps) return
    let name
    // official
    if (deps[(name = `@vue/cli-plugin-${pluginName}`)]) {
      return name
    }
    // full id, scoped short, or default short
    if (deps[(name = resolvePluginId(pluginName))]) {
      return name
    }
  }

  const id = findPlugin(pkg.devDependencies) || findPlugin(pkg.dependencies)
  if (!id) {
    throw new Error(
      `Cannot resolve plugin ${chalk.yellow(pluginName)} from package.json. ` +
        `Did you forget to install it?`
    )
  }

  const pluginGenerator = loadModule(`${id}/generator`, context)
  if (!pluginGenerator) {
    throw new Error(`Plugin ${id} does not have a generator.`)
  }

  const plugin = {
    id,
    apply: pluginGenerator,
    options: {},
  }

  await runGenerator(context, plugin, pkg)
}

async function runGenerator(context, plugin, pkg) {
  const generator = new Generator(context, {
    pkg,
    plugins: [plugin],
    files: await readFiles(context),
    invoking: true,
  })
  log()
  log(`🚀  Invoking generator for ${plugin.id}...`)
  await generator.generate({
    checkExisting: true,
  })
  const newDeps = generator.pkg.dependencies
  const newDevDeps = generator.pkg.devDependencies
  const depsChanged =
    JSON.stringify(newDeps) !== JSON.stringify(pkg.dependencies) ||
    JSON.stringify(newDevDeps) !== JSON.stringify(pkg.devDependencies)

  if (depsChanged) {
    log(`📦  Installing additional dependencies...`)
    log()
    await execa('npm', ['install'], context)
  }
  log(
    `${chalk.green(
      '✔'
    )}  Successfully invoked generator for plugin: ${chalk.cyan(plugin.id)}`
  )
}
module.exports = (...args) => {
  return invoke(...args).catch(() => {
    process.exit(1)
  })
}
