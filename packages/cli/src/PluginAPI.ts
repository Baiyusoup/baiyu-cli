import path from 'path';
import fs from 'fs-extra';
import deepmerge from 'deepmerge';
import { isBinaryFileSync } from 'isbinaryfile';
import { globby } from 'globby';
import { mergeDeps, mergeArray } from './utils/merge';
import type Generator from './Generator';

const isObj = (target: any) => target !== null && typeof target === 'object';
const isFunc = (target: any): target is Function => typeof target === 'function';
const isArray = (target: any) => Array.isArray(target);

class PluginAPI {
  id: string;
  generator: Generator;
  options: Record<string, any>;
  rootOptions: Record<string, any>;
  constructor(
    id: string,
    generator: Generator,
    options: Record<string, any>,
    rootOptions: Record<string, any>,
  ) {
    this.id = id;
    this.generator = generator;
    this.options = options;
    this.rootOptions = rootOptions;
  }

  private _injectMiddleware(middleware: Function) {
    this.generator.fileMiddlewareList.push(middleware);
  }

  hasPlugin(id: string) {
    return this.generator.hasPlugin(id);
  }

  extendPackage(fields: Record<string, any> | Function) {
    const pkg = this.generator.pkg;
    const toMerge = isFunc(fields) ? fields(pkg) : fields;

    for (const key in toMerge) {
      const value = toMerge[key];
      const existing = pkg[key];

      if (isObj(value) && (key === 'dependencies' || key === 'devDependencies')) {
        pkg[key] = mergeDeps(existing || {}, value);
      } else if (!(key in pkg)) {
        pkg[key] = value;
      } else if (isArray(value) && isArray(existing)) {
        pkg[key] = mergeArray(existing, value);
      } else if (isObj(value) && isObj(existing)) {
        pkg[key] = deepmerge(existing, value, {
          arrayMerge: mergeArray,
        });
      } else {
        pkg[key] = value;
      }
    }
  }

  render(source: any) {
    const baseDir = extractCallDir();
    if (typeof source === 'string') {
      source = path.resolve(baseDir, source);
      this._injectMiddleware(async (files: Record<string, any>) => {
        const _files = await globby(['**/*'], { cwd: source, dot: true });
        for (const rawPath of _files) {
          const targetPath = rawPath
            .split('/')
            .map((filename) => {
              const firstChar = filename[0],
                secondChar = filename[1];
              if (firstChar === '_' && secondChar !== '_') {
                return `.${filename.slice(1)}`;
              }

              if (firstChar === '_' && secondChar === '_') {
                return filename.slice(1);
              }

              return filename;
            })
            .join('/');

          const sourcePath = path.resolve(source, rawPath);
          const content = renderFile(sourcePath);
          if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
            files[targetPath] = content;
          }
        }
      });
    } else if (typeof source === 'function') {
      this._injectMiddleware(source);
    }
  }

  postProcessFile(cb: Function) {
    this.generator.postProcessFilesCbs.push(cb);
  }

  resolve(...paths: any[]) {
    return path.resolve(this.generator.context, ...paths);
  }
}

function extractCallDir() {
  const obj: any = {};
  Error.captureStackTrace(obj);
  const callSite = obj.stack.split('\n')[3];
  // the regexp for the stack when called inside a named function
  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/;
  // the regexp for the stack when called inside an anonymous
  const anonymousStackRegExp = /at (.*):\d+:\d+$/;

  let matchResult = callSite.match(namedStackRegExp);
  if (!matchResult) {
    matchResult = callSite.match(anonymousStackRegExp);
  }

  const fileName = matchResult[1];
  return path.dirname(fileName);
}

function renderFile(name: any) {
  if (isBinaryFileSync(name)) {
    return fs.readFileSync(name);
  }
  return fs.readFileSync(name);
}

export default PluginAPI;
