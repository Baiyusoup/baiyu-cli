import PluginAPI from 'PluginAPI';
import { normalizeFilePath } from './utils/normalizeFilePath';
import sortObject from './utils/sortObject';
import writeFileTree from './utils/writeFileTree';
import { PKG_KEY_ORDER, PRESET_PLUGIN_ID } from './utils/constants';
import type { IGeneratorOptions, IPlugin, PKG } from './types';

class Generator {
  private plugins: IPlugin[];
  private invoking: boolean;
  pkg: PKG;
  context: string;
  files: Record<string, any>;
  rootOptions: Record<string, any>;
  fileMiddlewareList: Array<Function>;
  postProcessFilesCbs: Array<Function>;
  constructor({ context, pkg = {}, plugins = [], files = {} }: IGeneratorOptions) {
    this.context = context;
    this.plugins = plugins;
    this.pkg = Object.assign({}, pkg);
    this.files = files;
    this.fileMiddlewareList = [];
    this.postProcessFilesCbs = [];
    const baiyuTemplates = plugins.find((p) => p.id === PRESET_PLUGIN_ID.templates);
    this.rootOptions = baiyuTemplates.options;
  }

  async generate() {
    await this.initPlugin();
    const initialFiles = Object.assign({}, this.files);
    await this.resolveFiles();
    this.sortPkg();
    this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n';

    await writeFileTree(this.context, this.files, initialFiles);
  }

  async initPlugin() {
    const { rootOptions, invoking } = this;

    for (const plugin of this.plugins) {
      const { id, apply, options } = plugin;
      const api = new PluginAPI(id, this, options, rootOptions);
      await apply(api, options, rootOptions, invoking);
    }
  }

  async resolveFiles() {
    const files = this.files;
    for (const middleware of this.fileMiddlewareList) {
      await middleware(files);
    }

    normalizeFilePath(files);

    for (const postProcess of this.postProcessFilesCbs) {
      await postProcess(files);
    }
  }

  sortPkg() {
    this.pkg.dependencies = sortObject(this.pkg.dependencies);
    this.pkg.devDependencies = sortObject(this.pkg.devDependencies);
    this.pkg = sortObject(this.pkg, PKG_KEY_ORDER);
  }

  hasPlugin(id: string) {
    const pluginExists = [...this.plugins.map((p) => p.id)].some((pid) => pid.includes(id));
    return pluginExists;
  }
}

export default Generator;