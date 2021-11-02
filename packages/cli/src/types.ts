export interface InitOptions {
  name: string;
}

export type PromptChoices = {
  name: string;
  value: string;
  checked?: boolean;
};

export type Preset = {
  plugins: Record<string, any>;
  [propName: string]: any;
};

export interface InquirerPrompt {
  name: string;
  type: string;
  message: string;
  when?: (answer: any) => boolean;
  choices?: Array<PromptChoices>;
}

export interface PKG {
  peerDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;

  [key: string]: any;
}

export interface IPlugin {
  id: string;
  apply: Function;
  options: Record<string, any>;
}

export interface IGeneratorOptions {
  context: string;
  pkg: PKG;
  plugins: IPlugin[];
  files?: Record<string, any>;
  invoking?: boolean;
}
