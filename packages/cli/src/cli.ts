#!/usr/bin/env node
import { program } from 'commander';
import { log } from './utils/log';
import create from './actions/create';

program
  .version(`Baiyu CLI v${require('../package.json').version}`)
  .description('Baiyu CLI是作者个人自用手脚架')
  .usage('<command> [options]');

program
  .command('create <project-name>')
  .description('创建一个新项目')
  .action(async (projectName) => {
    await create({ projectName });
  });

program.on('--help', () => {
  log();
  log(' 运行baiyu <command> --help获取命令使用说明');
  log();
});

program.commands.forEach((c) => c.on('--help', () => log()));
program.parse(process.argv);
