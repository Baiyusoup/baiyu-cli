const merge = require('deepmerge')
const extendJSConfig = require('./extendJSConfig')
const { loadModule } = require('@vue/cli-shared-utils')

const mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]))

const isObject = (val) => val && typeof val === 'object'

const transformJS = {
  read: ({ filename, context }) => {
    try {
      return loadModule(`./${filename}`, context, true)
    } catch (e) {
      return null
    }
  },
  write: ({ value, existing, source }) => {
    if (existing) {
      const changeData = {}
      Object.keys(value).forEach((key) => {
        const originalValue = existing[key]
        const newValue = value[key]
        if (Array.isArray(originalValue) && Array.isArray(newValue)) {
          changeData[key] = mergeArrayWithDedupe(originalValue, newValue)
        } else if (isObject(originalValue) && isObject(newValue)) {
          changeData[key] = merge(originalValue, newValue)
        } else {
          changeData[key] = newValue
        }
      })
      return extendJSConfig(changeData, source)
    } else {
      return `module.exports = ${JSON.stringify(value, null, 2)}`
    }
  },
}
const transformLines = {
  read: ({ source }) => source.split('\n'),
  write: ({ value, existing }) => {
    if (existing) {
      value = existing.concat(value)
      // Dedupe
      value = value.filter((item, index) => value.indexOf(item) === index)
    }
    return value.join('\n')
  },
}

module.exports = {
  js: transformJS,
  lines: transformLines,
}
