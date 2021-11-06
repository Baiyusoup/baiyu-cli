"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_exists_1 = require("command-exists");
const promise = new Promise((resolve) => {
    if ((0, command_exists_1.sync)('yarn'))
        return resolve('yarn');
    return resolve('npm');
});
exports.default = promise;
