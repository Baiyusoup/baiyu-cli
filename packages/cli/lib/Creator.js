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
const ora_1 = __importDefault(require("ora"));
const execa_1 = __importDefault(require("execa"));
const inquirer_1 = __importDefault(require("inquirer"));
const PromptAPI_1 = __importDefault(require("./presetPrompt/PromptAPI"));
const pkgManger_1 = __importDefault(require("./utils/pkgManger"));
const writeFileTree_1 = __importDefault(require("./utils/writeFileTree"));
const sortObject_1 = __importDefault(require("./utils/sortObject"));
const Generator_1 = __importDefault(require("./Generator"));
const loadModule_1 = require("./utils/loadModule");
const constants_1 = require("./utils/constants");
const log_1 = require("./utils/log");
class Creator {
    constructor(name, context, presetPrompts) {
        this.name = name;
        this.context = context;
        this.featurePrompt = this.resolveIntroPrompt();
        this.injectPrompt = [];
        this.promptCompleteCbs = [];
        const promptAPI = new PromptAPI_1.default(this);
        presetPrompts.forEach((m) => m(promptAPI));
    }
    run(command, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const spinner = (0, ora_1.default)(` Now is running ${command} ${args && args.join(' ')}...`);
            spinner.start();
            const res = yield (0, execa_1.default)(command, args, { cwd: this.context });
            spinner.stop();
            return res;
        });
    }
    resolveIntroPrompt() {
        const featurePrompt = {
            name: 'features',
            type: 'checkbox',
            message: 'Check the features needed for your project:',
            choices: [],
        };
        return featurePrompt;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const preset = yield this.resolvePreset();
            const pkgManger = yield pkgManger_1.default;
            preset.projectName = this.name;
            (0, log_1.log)(`✨ Creating project...`);
            const pkg = {
                name: this.name,
                version: '1.0.0',
                private: true,
                devDependencies: {},
            };
            const deps = Object.keys(preset.plugins);
            deps.forEach((dep) => {
                let { version } = preset.plugins[dep];
                if (!version) {
                    version = '~0.1.0';
                }
                pkg.devDependencies[dep] = version;
            });
            yield (0, writeFileTree_1.default)(this.context, {
                'package.json': JSON.stringify(pkg, null, 2),
            });
            (0, log_1.log)(`🗃 Initialing git...`);
            yield this.run('git', ['init']);
            (0, log_1.log)(`⚙\u{fe0f} Install plugins...`);
            (0, log_1.log)();
            yield this.run(pkgManger, [constants_1.PACKAGE_MANAGER_CONFIG[pkgManger].install]);
            (0, log_1.log)(`🚀 Invoking plugins...`);
            const plugins = yield this.resolvePlugins(preset.plugins);
            const generator = new Generator_1.default({
                context: this.context,
                pkg,
                plugins,
                rootOptions: preset,
            });
            yield generator.generate();
            (0, log_1.log)();
            (0, log_1.log)(`🎉 Create ${this.name} success.`);
            (0, log_1.log)();
        });
    }
    resolvePreset() {
        return __awaiter(this, void 0, void 0, function* () {
            const answer = yield inquirer_1.default.prompt(this.resolveFinalPrompt());
            const preset = {
                plugins: {},
            };
            answer.features = answer.features || [];
            this.promptCompleteCbs.forEach((cb) => cb(answer, preset));
            (0, log_1.clearConsole)();
            return preset;
        });
    }
    resolveFinalPrompt() {
        return [this.featurePrompt, ...this.injectPrompt];
    }
    resolvePlugins(rawPlugins) {
        return __awaiter(this, void 0, void 0, function* () {
            rawPlugins = (0, sortObject_1.default)(rawPlugins, [constants_1.PRESET_PLUGIN_ID.templates], true);
            const plugins = [];
            for (const id of Object.keys(rawPlugins)) {
                const apply = (yield (0, loadModule_1.loadModule)(`${id}/generator`, this.context)) || (() => { });
                let options = rawPlugins[id] || {};
                plugins.push({ id, apply, options });
            }
            return plugins;
        });
    }
}
exports.default = Creator;
