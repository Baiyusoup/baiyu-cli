const path = require('path')
const fs = require('fs')
const deepmerge = require('deepmerge')
const { isBinaryFileSync } = require('isbinaryfile')
const mergeDeps = require('./utils/mergeDeps')

const isFunction = (val) => typeof val === 'function'
const isObject = (val) => val && typeof val === 'object'
const mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]))

function pruneObject(obj) {
  if (typeof obj === 'object') {
    for (const k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) {
        continue
      }

      if (obj[k] == null) {
        delete obj[k]
      } else {
        obj[k] = pruneObject(obj[k])
      }
    }
  }

  return obj
}

class GeneratorAPI {
  constructor(id, generator, options, rootOptions) {
    this.id = id
    this.generator = generator
    this.options = options
    this.rootOptions = rootOptions

    this.pluginData = []

    this._entryFile = undefined
  }

  /**
   * Inject a file processing middleware.
   */
  _injectFileMiddleware(middleware) {
    this.generator.fileMiddlewares.push(middleware)
  }

  resolve(..._paths) {
    return path.resolve(this.generator.context, ..._paths)
  }

  get cliVersion() {
    return require('../package.json').version
  }

  hasPlugin(id, versionRange) {
    return this.generator.hasPlugin(id, versionRange)
  }

  extendPackage(fields, options = {}) {
    const extendOptions = {
      prune: false,
      merge: true,
      warnIncompatibleVersions: true,
      forceOverwrite: false,
    }

    if (typeof options === 'boolean') {
      extendOptions.warnIncompatibleVersions = !options
    } else {
      Object.assign(extendOptions, options)
    }

    const pkg = this.generator.pkg
    const toMerge = isFunction(fields) ? fields(pkg) : fields
    for (const key in toMerge) {
      const value = toMerge[key]
      const existing = pkg[key]
      if (
        isObject(value) &&
        (key === 'dependencies' || key === 'devDependencies')
      ) {
        // use special version resolution merge
        pkg[key] = mergeDeps(
          this.id,
          existing || {},
          value,
          this.generator.depsSources
        )
      } else if (!extendOptions.merge || !(key in pkg)) {
        pkg[key] = value
      } else if (Array.isArray(value) && Array.isArray(existing)) {
        pkg[key] = mergeArrayWithDedupe(existing, value)
      } else if (isObject(value) && isObject(existing)) {
        pkg[key] = deepmerge(existing, value, {
          arrayMerge: mergeArrayWithDedupe,
        })
      } else {
        pkg[key] = value
      }
    }

    if (extendOptions.prune) {
      pruneObject(pkg)
    }
  }

  render(source) {
    // const context = this.generator.context
    const baseDir = extractCallDir()
    if (typeof source === 'string') {
      // 模板文件所在路径
      source = path.resolve(baseDir, source)
      this._injectFileMiddleware(async (files) => {
        const globby = require('globby')
        const _files = await globby(['**/*'], { cwd: source, dot: true })
        for (const rawPath of _files) {
          const targetPath = rawPath
            .split('/')
            .map((filename) => {
              if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {
                return `.${filename.slice(1)}`
              }
              if (filename.charAt(0) === '_' && filename.charAt(1) === '_') {
                return `${filename.slice(1)}`
              }
              return filename
            })
            .join('/')
          const sourcePath = path.resolve(source, rawPath)
          const content = renderFile(sourcePath)
          if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
            files[targetPath] = content
          }
        }
      })
    } else if (typeof source === 'function') {
      this._injectFileMiddleware(source)
    }
  }

  postProcessFiles(cb) {
    this.generator.postProcessFilesCbs.push(cb)
  }
}

function extractCallDir() {
  // extract api.render() callsite file location using error stack
  const obj = {}
  Error.captureStackTrace(obj)
  const callSite = obj.stack.split('\n')[3]

  // the regexp for the stack when called inside a named function
  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/
  // the regexp for the stack when called inside an anonymous
  const anonymousStackRegExp = /at (.*):\d+:\d+$/

  let matchResult = callSite.match(namedStackRegExp)
  if (!matchResult) {
    matchResult = callSite.match(anonymousStackRegExp)
  }

  const fileName = matchResult[1]
  return path.dirname(fileName)
}

function renderFile(name) {
  if (isBinaryFileSync(name)) {
    // 处理二进制文件，比如说图片之类
    return fs.readFileSync(name)
  }
  return fs.readFileSync(name, 'utf-8')
}

module.exports = GeneratorAPI
