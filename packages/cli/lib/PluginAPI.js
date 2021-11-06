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
const deepmerge_1 = __importDefault(require("deepmerge"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const globby_1 = __importDefault(require("globby"));
const ejs_1 = __importDefault(require("ejs"));
const merge_1 = require("./utils/merge");
const isbinaryfile_1 = require("isbinaryfile");
const isObj = (target) => target !== null && typeof target === 'object';
const isFunc = (target) => typeof target === 'function';
const isArray = (target) => Array.isArray(target);
class PluginAPI {
    constructor(id, generator, options, rootOptions) {
        this.id = id;
        this.generator = generator;
        this.options = options;
        this.rootOptions = rootOptions;
    }
    _injectMiddleware(middleware) {
        this.generator.fileMiddlewareList.push(middleware);
    }
    hasPlugin(id) {
        return this.generator.hasPlugin(id);
    }
    extendPackage(fields) {
        const pkg = this.generator.pkg;
        const toMerge = isFunc(fields) ? fields(pkg) : fields;
        for (const key in toMerge) {
            const value = toMerge[key];
            const existing = pkg[key];
            if (isObj(value) && (key === 'dependencies' || key === 'devDependencies')) {
                pkg[key] = (0, merge_1.mergeDeps)(existing || {}, value);
            }
            else if (!(key in pkg)) {
                pkg[key] = value;
            }
            else if (isArray(value) && isArray(existing)) {
                pkg[key] = (0, merge_1.mergeArray)(existing, value);
            }
            else if (isObj(value) && isObj(existing)) {
                pkg[key] = (0, deepmerge_1.default)(existing, value, {
                    arrayMerge: merge_1.mergeArray,
                });
            }
            else {
                pkg[key] = value;
            }
        }
    }
    render(source, additionalData, ejsOptions) {
        const baseDir = extractCallDir();
        if (typeof source === 'string') {
            source = path_1.default.resolve(baseDir, source);
            this._injectMiddleware((files) => __awaiter(this, void 0, void 0, function* () {
                const _files = yield (0, globby_1.default)(['**/*'], { cwd: source, dot: true });
                for (const rawPath of _files) {
                    const targetPath = rawPath
                        .split('/')
                        .map((filename) => {
                        const firstChar = filename[0];
                        const secondChar = filename[1];
                        if (firstChar === '_' && secondChar !== '_') {
                            return `.${filename.slice(1)}`;
                        }
                        if (firstChar === '_' && secondChar === '_') {
                            return filename.slice(1);
                        }
                        return filename;
                    })
                        .join('/');
                    const sourcePath = path_1.default.resolve(source, rawPath);
                    const content = yield renderFile(sourcePath, additionalData, ejsOptions);
                    if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
                        files[targetPath] = content;
                    }
                }
            }));
        }
        else if (typeof source === 'function') {
            this._injectMiddleware(source);
        }
    }
    postProcessFile(cb) {
        this.generator.postProcessFilesCbs.push(cb);
    }
    resolve(...paths) {
        return path_1.default.resolve(this.generator.context, ...paths);
    }
}
function extractCallDir() {
    const obj = {};
    Error.captureStackTrace(obj);
    const callSite = obj.stack.split('\n')[3];
    const namedStackRegExp = /\s\((.*):\d+:\d+\)$/;
    const anonymousStackRegExp = /at (.*):\d+:\d+$/;
    let matchResult = callSite.match(namedStackRegExp);
    if (!matchResult) {
        matchResult = callSite.match(anonymousStackRegExp);
    }
    const fileName = matchResult[1];
    return path_1.default.dirname(fileName);
}
function renderFile(filename, data, ejsOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, isbinaryfile_1.isBinaryFileSync)(filename)) {
            return fs_extra_1.default.readFileSync(filename);
        }
        let content = yield ejs_1.default.render(fs_extra_1.default.readFileSync(filename, 'utf-8'), data || {}, ejsOptions || {});
        if (/^_*vscode/.test(filename)) {
            content = (0, merge_1.mergeVSCodeConfig)(filename, content);
        }
        return content;
    });
}
exports.default = PluginAPI;
