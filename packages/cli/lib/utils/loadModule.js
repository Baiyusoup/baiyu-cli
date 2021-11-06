"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModule = exports.resolveModule = void 0;
const module_1 = __importDefault(require("module"));
const path_1 = __importDefault(require("path"));
const createRequire = module_1.default.createRequire;
const resolve = require.resolve;
function resolveModule(request, context) {
    let resolvedPath;
    try {
        try {
            resolvedPath = createRequire(path_1.default.resolve(context, 'package.json')).resolve(request);
        }
        catch (e) {
            resolvedPath = resolve(request, { paths: [context] });
        }
    }
    catch (e) { }
    return resolvedPath;
}
exports.resolveModule = resolveModule;
function loadModule(request, context, force = false) {
    try {
        return createRequire(path_1.default.resolve(context, 'package.json'))(request);
    }
    catch (e) {
        const resolvedPath = exports.resolveModule(request, context);
        if (resolvedPath) {
            if (force) {
                clearRequireCache(resolvedPath);
            }
            return require(resolvedPath);
        }
    }
}
exports.loadModule = loadModule;
function clearRequireCache(id, map = new Map()) {
    const module = require.cache[id];
    if (module) {
        map.set(id, true);
        module.children.forEach((child) => {
            if (!map.get(child.id))
                clearRequireCache(child.id, map);
        });
        delete require.cache[id];
    }
}
