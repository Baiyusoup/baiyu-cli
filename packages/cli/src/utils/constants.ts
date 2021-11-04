export enum PRESET_PLUGIN_ID {
  templates = '@baiyusoup/templates',
  lint = '@baiyusoup/lint-config',
}

export const PKG_KEY_ORDER = [
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

export const PACKAGE_MANAGER_CONFIG = {
  npm: {
    install: 'install',
  },
  yarn: {
    install: 'install',
  },
};
