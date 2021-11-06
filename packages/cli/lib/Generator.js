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
const ejs_1 = __importDefault(require("ejs"));
const PluginAPI_1 = __importDefault(require("./PluginAPI"));
const sortObject_1 = __importDefault(require("./utils/sortObject"));
const writeFileTree_1 = __importDefault(require("./utils/writeFileTree"));
const matchesPluginId_1 = require("./utils/matchesPluginId");
const normalizeFilePath_1 = require("./utils/normalizeFilePath");
const constants_1 = require("./utils/constants");
class Generator {
    constructor({ context, pkg = {}, plugins = [], files = {}, rootOptions }) {
        this.context = context;
        this.plugins = plugins;
        this.pkg = Object.assign({}, pkg);
        this.files = files;
        this.fileMiddlewareList = [];
        this.postProcessFilesCbs = [];
        this.rootOptions = rootOptions;
    }
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initPlugin();
            const initialFiles = Object.assign({}, this.files);
            yield this.resolveFiles();
            this.sortPkg();
            this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n';
            yield (0, writeFileTree_1.default)(this.context, this.files, initialFiles);
        });
    }
    initPlugin() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootOptions } = this;
            for (const plugin of this.plugins) {
                const { id, apply, options } = plugin;
                const api = new PluginAPI_1.default(id, this, options, rootOptions);
                yield apply(api, options, rootOptions);
            }
        });
    }
    resolveFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = this.files;
            for (const middleware of this.fileMiddlewareList) {
                yield middleware(files, ejs_1.default.render);
            }
            (0, normalizeFilePath_1.normalizeFilePath)(files);
            for (const postProcess of this.postProcessFilesCbs) {
                yield postProcess(files);
            }
        });
    }
    sortPkg() {
        this.pkg.dependencies = (0, sortObject_1.default)(this.pkg.dependencies);
        this.pkg.devDependencies = (0, sortObject_1.default)(this.pkg.devDependencies);
        this.pkg = (0, sortObject_1.default)(this.pkg, constants_1.PKG_KEY_ORDER);
    }
    hasPlugin(id) {
        const pluginExists = [...this.plugins.map((p) => p.id)].some((pid) => (0, matchesPluginId_1.matchesPluginId)(id, pid));
        return pluginExists;
    }
}
exports.default = Generator;
