"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
function default_1(api) {
    api.injectFeature({
        name: 'Use linter and formatter',
        value: 'linter',
        checked: true,
    });
    api.injectPrompt({
        name: 'lintConfig',
        type: 'checkbox',
        message: 'Pick a linter and formatter config:',
        when: (answers) => answers.features.includes('linter'),
        choices: [
            {
                name: 'Eslint + Prettier',
                value: 'eslint',
                checked: true,
            },
            {
                name: 'Stylelint',
                value: 'stylelint',
            },
            {
                name: 'Markdownlint',
                value: 'markdownlint',
            },
        ],
    });
    api.onPromptCompleteCb((answers, options) => {
        if (answers.features.includes('linter')) {
            options.plugins[constants_1.PRESET_PLUGIN_ID.lint] = {
                config: answers.lintConfig,
            };
        }
    });
}
exports.default = default_1;
