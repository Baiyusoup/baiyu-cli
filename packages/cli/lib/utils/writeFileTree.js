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
function deleteRemoveFiles(dir, newFiles, prevFiles) {
    const filesToDelete = Object.keys(prevFiles).filter((filename) => !newFiles[filename]);
    return Promise.all(filesToDelete.map((filename) => {
        return fs_extra_1.default.unlink(path_1.default.join(dir, filename));
    }));
}
function default_1(dir, files, preFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        if (preFiles) {
            yield deleteRemoveFiles(dir, files, preFiles);
        }
        Object.keys(files).forEach((name) => {
            const filePath = path_1.default.join(dir, name);
            fs_extra_1.default.ensureDirSync(path_1.default.dirname(filePath));
            fs_extra_1.default.writeFileSync(filePath, files[name]);
        });
    });
}
exports.default = default_1;
