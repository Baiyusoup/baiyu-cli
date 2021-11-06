"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACKAGE_MANAGER_CONFIG = exports.PKG_KEY_ORDER = exports.PRESET_PLUGIN_ID = void 0;
var PRESET_PLUGIN_ID;
(function (PRESET_PLUGIN_ID) {
    PRESET_PLUGIN_ID["templates"] = "@baiyusoup/templates";
    PRESET_PLUGIN_ID["lint"] = "@baiyusoup/lint-config";
})(PRESET_PLUGIN_ID = exports.PRESET_PLUGIN_ID || (exports.PRESET_PLUGIN_ID = {}));
exports.PKG_KEY_ORDER = [
    'name',
    'version',
    'author',
    'private',
    'main',
    'description',
    'scripts',
    'module',
    'browser',
    'files',
    'dependencies',
    'devDependencies',
    'peerDependencies',
];
exports.PACKAGE_MANAGER_CONFIG = {
    npm: {
        install: 'install',
    },
    yarn: {
        install: 'install',
    },
};
