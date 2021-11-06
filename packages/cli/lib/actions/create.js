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
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const validate_npm_package_name_1 = __importDefault(require("validate-npm-package-name"));
const Creator_1 = __importDefault(require("../Creator"));
const presetPrompt_1 = __importDefault(require("../presetPrompt"));
function create(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectName } = options;
        const validationResult = (0, validate_npm_package_name_1.default)(projectName);
        if (!validationResult.validForNewPackages) {
            console.error(`Invalidate projectName: ${projectName}`);
            validationResult.errors && validationResult.errors.forEach((err) => console.error(err));
            validationResult.warnings && validationResult.warnings.forEach((warn) => console.warn(warn));
        }
        const context = process.cwd();
        const projectDir = path_1.default.resolve(context, projectName);
        if (fs_extra_1.default.existsSync(projectDir)) {
            console.log('The project directory is existing!');
            const { action } = yield inquirer_1.default.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: 'Does you want to do ?',
                    choices: [
                        { name: '覆盖', value: 'overwrite' },
                        { name: '终止', value: 'cancel' },
                    ],
                },
            ]);
            if (action === 'overwrite') {
                console.log(`\nRemoving ${projectDir}...`);
                yield fs_extra_1.default.remove(projectDir);
            }
            else {
                console.log('You cancel created project!');
                return;
            }
        }
        const creator = new Creator_1.default(projectName, projectDir, (0, presetPrompt_1.default)());
        yield creator.start();
    });
}
function default_1(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return create(options);
        }
        catch (e) {
            console.error(e);
            process.exit(1);
        }
    });
}
exports.default = default_1;
