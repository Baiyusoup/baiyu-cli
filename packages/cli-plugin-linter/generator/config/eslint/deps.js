const BASE_DEPS_MAP = {
  base: {
    eslint: '^7.20.0',
    'eslint-plugin-prettier': '^4.0.0',
    'eslint-config-prettier': '^8.3.0',
    'eslint-plugin-import': '^2.24.2',
  },
  typescript: {
    'eslint-import-resolver-typescript': '^2.5.0',
    '@typescript-eslint/eslint-plugin': '^4.33.0',
    '@typescript-eslint/parser': '^4.33.0',
  },
}

const VUE_DEPS_MAP = {
  base: {
    'eslint-plugin-vue': '^7.19.1',
  },
}

const REACT_DEPS_MAP = {
  base: {
    'eslint-plugin-react': '^7.26.1',
    'eslint-plugin-react-hooks': '^4.2.0',
    'eslint-plugin-jsx-a11y': '^6.4.1',
  },
}

// exports.DEPS_MAP = DEPS_MAP
exports.BASE_DEPS_MAP = BASE_DEPS_MAP
exports.VUE_DEPS_MAP = VUE_DEPS_MAP
exports.REACT_DEPS_MAP = REACT_DEPS_MAP

exports.getDeps = function (api, preset) {
  const deps = Object.assign({}, BASE_DEPS_MAP.base)
  if (api.hasPlugin('typescript')) {
    Object.assign(deps, BASE_DEPS_MAP.typescript)
  }
  if (!preset) {
    return deps
  }
  Object.assign(deps, [`${(preset + '').toUpperCase()}_DEPS_MAP`].base)
  return deps
}
