export enum PRESET_PLUGIN_ID {
  templates = '@baiyusoup/templates',
  lint = '@baiyusouup/lint-config',
}

export const PKG_KEY_ORDER = [
  'name',
  'version',
  'private',
  'description',
  'author',
  'scripts',
  'main',
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
    install: 'add',
  },
};
