"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.clearConsole = void 0;
function clearConsole() {
    process.stdout.write('\x1b[2J');
    process.stdout.write('\x1b[0f');
}
exports.clearConsole = clearConsole;
function log(message) {
    console.log(message);
}
exports.log = log;
