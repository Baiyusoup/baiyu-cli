import path from 'path';
import fs from 'fs-extra';

const pkg: Record<string, any> = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'),
);

export const PKG_NAME: string = pkg.name;

export const PKG_VERSION: string = pkg.version;

export enum PRESET_PLUGIN_ID {
  templates = '@baiyusoup/baiyu-templates',
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
