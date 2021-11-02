import Module from 'module';
import path from 'path';

const createRequire = Module.createRequire;

const resolve = require.resolve;

export function resolveModule(request, context) {
  let resolvedPath;
  try {
    try {
      resolvedPath = createRequire(path.resolve(context, 'package.json')).resolve(request);
    } catch (e) {
      resolvedPath = resolve(request, { paths: [context] });
    }
  } catch (e) {}
  return resolvedPath;
}

export function loadModule(request, context, force = false) {
  try {
    return createRequire(path.resolve(context, 'package.json'))(request);
  } catch (e) {
    const resolvedPath = exports.resolveModule(request, context);
    if (resolvedPath) {
      if (force) {
        clearRequireCache(resolvedPath);
      }
      return require(resolvedPath);
    }
  }
}

function clearRequireCache(id, map = new Map()) {
  const module = require.cache[id];
  if (module) {
    map.set(id, true);
    // Clear children modules
    module.children.forEach((child) => {
      if (!map.get(child.id)) clearRequireCache(child.id, map);
    });
    delete require.cache[id];
  }
}
