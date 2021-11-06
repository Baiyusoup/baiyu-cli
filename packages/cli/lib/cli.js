#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const create_1 = __importDefault(require("./actions/create"));
commander_1.program
    .version(`Baiyu CLI v${require('../package.json').version}`)
    .description('Baiyu CLI是作者个人自用手脚架')
    .usage('<command> [options]');
commander_1.program
    .command('create <project-name>')
    .description('创建一个新项目')
    .action((projectName) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, create_1.default)({ projectName });
}));
commander_1.program.on('--help', () => {
    console.log();
    console.log(' 运行baiyu <command> --help获取命令使用说明');
    console.log();
});
commander_1.program.commands.forEach((c) => c.on('--help', () => console.log()));
commander_1.program.parse(process.argv);
