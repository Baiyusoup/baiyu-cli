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
}

export function mergeArray(source: Array<any>, target: Array<any>) {
  return Array.from(new Set(...source, ...target));
}
