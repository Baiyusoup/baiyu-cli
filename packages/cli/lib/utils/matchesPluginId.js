"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesPluginId = void 0;
const pluginRE = /^(@baiyusoup\/|baiyusoup-|@[\w-]+(\.)?[\w-]+\/baiyusoup-)cli-plugin-/;
const scopeRE = /^@[\w-]+(\.)?[\w-]+\//;
function matchesPluginId(input, full) {
    const short = full.replace(pluginRE, '');
    return full === input || short === input || short === input.replace(scopeRE, '');
}
exports.matchesPluginId = matchesPluginId;
