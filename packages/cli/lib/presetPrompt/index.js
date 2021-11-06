"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const templates_1 = __importDefault(require("./presets/templates"));
const css_1 = __importDefault(require("./presets/css"));
const lint_1 = __importDefault(require("./presets/lint"));
function default_1() {
    return [templates_1.default, css_1.default, lint_1.default];
}
exports.default = default_1;
