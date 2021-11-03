import fs from 'fs-extra';
import deepmerge from 'deepmerge';

export function mergeDeps(source: Record<string, any>, target: Record<string, any>): any {
  const result = Object.assign({}, source);
  for (const depName in target) {
    const sourceRange = source[depName];
    const targetRange = target[depName];

    // 两个依赖相同
    if (sourceRange === targetRange) continue;

    if (targetRange == null) {
      delete result[depName];
      continue;
    }

    result[depName] = targetRange;
  }
  return result;
}

export function mergeArray(source: Array<any>, target: Array<any>) {
  return Array.from(new Set([...source, ...target]));
}

export function mergeVSCodeConfig(filepath: string, content: string): string {
  // 不需要合并
  if (!fs.existsSync(filepath)) return content;

  try {
    const targetData = fs.readJSONSync(filepath);
    const sourceData = JSON.parse(content);
    return JSON.stringify(
      deepmerge(targetData, sourceData, {
        arrayMerge: mergeArray,
      }),
      null,
      2,
    );
  } catch (e) {
    return '';
  }
}
