"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(api) {
    api.injectFeature({
        name: 'Use style files',
        value: 'style',
        checked: true,
    });
    api.injectPrompt({
        name: 'preprocessor',
        type: 'confirm',
        message: 'Do you want Preprocessor ?.',
        when: (answers) => answers.features.includes('style'),
    });
    api.onPromptCompleteCb((answers, options) => {
        if (answers.features.includes('style')) {
            options.css = true;
            options.preprocessor = answers.preprocessor;
        }
        else {
            options.css = false;
        }
    });
}
exports.default = default_1;
