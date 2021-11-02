import ora from 'ora';
import execa from 'execa';
import inquirer from 'inquirer';
import PromptAPI from './presetPrompt/PromptAPI';
import getPkgManger from './utils/pkgManger';
import writeFileTree from './utils/writeFileTree';
import sortObject from './utils/sortObject';
import Generator from 'Generator';
import { loadModule } from './utils/loadModule';
import { PRESET_PLUGIN_ID } from './utils/constants';
import { clearConsole, log } from './utils/log';
import type { InquirerPrompt, Preset, PKG } from './types';

const PACKAGE_MANAGER_CONFIG = {
  npm: {
    install: 'install',
  },
  yarn: {
    install: 'add',
  },
};

type TPlugin = {
  id: string;
  apply: Function;
  options: Record<string, any>;
};

class Creator {
  name: string;
  context: string;
  featurePrompt: InquirerPrompt;
  injectPrompt: InquirerPrompt[];
  promptCompleteCbs: Array<Function>;

  constructor(name: string, context: string, presetPrompts: any[]) {
    this.name = name;
    this.context = context;

    this.featurePrompt = this.resolveIntroPrompt();
    this.injectPrompt = [];
    this.promptCompleteCbs = [];

    const promptAPI = new PromptAPI(this);
    presetPrompts.forEach((m) => m(promptAPI));
  }

  private run(command: string, args: string[]) {
    const spiner = ora(` 现在正在执行 ${command} ${args && args.join(' ')}`).start();
    const res = execa(command, args, { cwd: this.context }).then(() => {
      spiner.stop();
    });
    return res;
  }

  resolveIntroPrompt() {
    const featurePrompt = {
      name: 'features',
      type: 'checkbox',
      message: '选择你想要的功能:',
      choices: [],
    };
    return featurePrompt;
  }

  async start() {
    const preset = await this.resolvePreset();
    const pkgManger = await getPkgManger;

    preset.plugins[PRESET_PLUGIN_ID.templates] = Object.assign(
      {
        projectName: this.name,
      },
      preset,
    );

    log(`✨ 正在创建项目...`);
    const pkg: PKG = {
      name: this.name,
      version: '1.0.0',
      private: true,
      devDependencies: {},
    };

    const deps = Object.keys(preset.plugins);
    deps.forEach((dep) => {
      let { version } = preset.plugins[dep];
      if (!version) {
        // TODO 获取插件的最新版本
        version = '~0.1.0';
      }
      pkg.devDependencies[dep] = version;
    });

    await writeFileTree(this.context, {
      'package.json': JSON.stringify(pkg, null, 2),
    });

    log(`🗃 初始化git仓库...`);
    await this.run('git', ['init']);

    log(`⚙\u{fe0f} 正在下载插件...`);
    log();
    await this.run(pkgManger, [PACKAGE_MANAGER_CONFIG[pkgManger].install]);

    log(`🚀 运行插件中...`);
    const plugins = await this.resolvePlugins(preset.plugins);
    const generator = new Generator({
      context: this.context,
      pkg,
      plugins,
    });

    await generator.generate();

    log(`📦 下载依赖中...`);
    await this.run(pkgManger, [PACKAGE_MANAGER_CONFIG[pkgManger].install]);

    log();
    log(`🎉 ${this.name} 创建成功.`);
    log();
  }

  async resolvePreset() {
    const answer = await inquirer.prompt(this.resolveFinalPrompt());
    const preset: Preset = {
      plugins: {},
    };
    answer.features = answer.features || [];
    this.promptCompleteCbs.forEach((cb) => cb(answer, preset));

    clearConsole();

    return preset;
  }

  resolveFinalPrompt() {
    return [this.featurePrompt, ...this.injectPrompt];
  }

  async resolvePlugins(rawPlugins: Record<string, any>) {
    rawPlugins = sortObject(rawPlugins, [PRESET_PLUGIN_ID.templates], true);
    const plugins: TPlugin[] = [];
    for (const id of Object.keys(rawPlugins)) {
      const apply = (await loadModule(`${id}/generator`, this.context)) || (() => {});
      let options = rawPlugins[id] || {};
      plugins.push({ id, apply, options });
    }
    return plugins;
  }
}

export default Creator;
