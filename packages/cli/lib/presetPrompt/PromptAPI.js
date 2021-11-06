"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PromptAPI {
    constructor(creator) {
        this.creator = creator;
    }
    injectFeature(feature) {
        this.creator.featurePrompt.choices.push(feature);
    }
    injectPrompt(prompt) {
        this.creator.injectPrompt.push(prompt);
    }
    onPromptCompleteCb(cb) {
        this.creator.promptCompleteCbs.push(cb);
    }
}
exports.default = PromptAPI;
