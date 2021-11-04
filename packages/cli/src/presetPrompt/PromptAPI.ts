import type Creator from '../Creator';
import type { PromptChoices, InquirerPrompt } from '../types';

class PromptAPI {
  private creator: Creator;
  constructor(creator: Creator) {
    this.creator = creator;
  }

  injectFeature(feature: PromptChoices) {
    this.creator.featurePrompt.choices.push(feature);
  }

  injectPrompt(prompt: InquirerPrompt) {
    this.creator.injectPrompt.push(prompt);
  }

  onPromptCompleteCb(cb: Function) {
    this.creator.promptCompleteCbs.push(cb);
  }
}

export default PromptAPI;
