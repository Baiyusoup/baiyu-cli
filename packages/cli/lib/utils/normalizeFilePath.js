"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeFilePath = void 0;
const slash_1 = __importDefault(require("slash"));
function normalizeFilePath(files) {
    Object.keys(files).forEach((file) => {
        const normalized = (0, slash_1.default)(file);
        if (file !== normalized) {
            files[normalized] = files[file];
            delete files[file];
        }
    });
    return files;
}
exports.normalizeFilePath = normalizeFilePath;
