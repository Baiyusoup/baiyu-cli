module.exports = function mergeDeps(
  generatorId,
  sourceDeps,
  depsToInject,
  sources
) {
  const result = Object.assign({}, sourceDeps)

  for (const depName in depsToInject) {
    const sourceRange = sourceDeps[depName]
    const injectingRange = depsToInject[depName]

    // 两个依赖相同，不需要合并了
    if (sourceRange === injectingRange) continue

    if (injectingRange == null) {
      delete result[depName]
      continue
    }

    // 如果原来没有这个依赖的话
    if (!sourceRange) {
      result[depName] = injectingRange
      sources[depName] = generatorId
    } else {
      // 如果原来有这个依赖的话，使用最新的
      result[depName] = injectingRange
    }
  }
  return result
}
