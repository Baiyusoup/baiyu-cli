"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeVSCodeConfig = exports.mergeArray = exports.mergeDeps = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const deepmerge_1 = __importDefault(require("deepmerge"));
function mergeDeps(source, target) {
    const result = Object.assign({}, source);
    for (const depName in target) {
        const sourceRange = source[depName];
        const targetRange = target[depName];
        if (sourceRange === targetRange)
            continue;
        if (targetRange == null) {
            delete result[depName];
            continue;
        }
        result[depName] = targetRange;
    }
    return result;
}
exports.mergeDeps = mergeDeps;
function mergeArray(source, target) {
    return Array.from(new Set([...source, ...target]));
}
exports.mergeArray = mergeArray;
function mergeVSCodeConfig(filepath, content) {
    if (!fs_extra_1.default.existsSync(filepath))
        return content;
    try {
        const targetData = fs_extra_1.default.readJSONSync(filepath);
        const sourceData = JSON.parse(content);
        return JSON.stringify((0, deepmerge_1.default)(targetData, sourceData, {
            arrayMerge: mergeArray,
        }), null, 2);
    }
    catch (e) {
        return '';
    }
}
exports.mergeVSCodeConfig = mergeVSCodeConfig;
