#!/usr/bin/env node
const { program } = require('commander')
program
  .version(`Baiyu CLI v${require('../package.json').version}`)
  .usage('<command> [options]')

program
  .command('create <project-name>')
  .description('创建一个新项目')
  .action((projectName) => {
    require('../lib/create')(projectName)
  })

program
  .command('add <plugin>')
  .description('添加新插件')
  .action((pluginToAdd) => {
    require('../lib/add')(pluginToAdd)
  })

program
  .command('invoke <plugin>')
  .description('调用插件')
  .action((pluginToInvoke) => {
    require('../lib/invoke')(pluginToInvoke)
  })

program.on('--help', () => {
  console.log()
  console.log(` 运行baiyu <command> --help获取命令使用详情`)
  console.log()
})

program.commands.forEach((c) => c.on('--help', () => console.log()))

program.parse(process.argv)
