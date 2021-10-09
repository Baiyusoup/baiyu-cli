const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const validateProjectName = require('validate-npm-package-name')
const Creator = require('./Creator')
const { getPromptModules } = require('./promptModules/getter')

async function create(projectName) {
  const validationResult = validateProjectName(projectName)

  if (!validationResult.validForNewPackages) {
    console.error(`Invalidate projectName: ${projectName}`)
    validationResult.errors &&
      validationResult.errors.forEach((err) => console.error(err))
    validationResult.warnings &&
      validationResult.warnings.forEach((warn) => console.warn(warn))
  }

  const projectDir = path.resolve(process.cwd(), projectName)

  if (fs.existsSync(projectDir)) {
    console.log(`The project directory is existing!`)
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: 'Does you want to do?',
        choices: [
          { name: '覆盖', value: 'overwrite' },
          { name: '终止', value: 'cancel' },
        ],
      },
    ])

    if (action === 'overwrite') {
      console.log(`\nRemoving ${projectDir}...`)
      await fs.remove(projectDir)
    } else {
      return
    }
  }

  const creator = new Creator(projectName, projectDir, getPromptModules())
  await creator.create()
}
module.exports = (...args) => {
  return create(...args).catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
