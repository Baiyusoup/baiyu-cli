const BASE_DEPS_MAP = {
  base: {
    eslint: '^7.20.0',
    'eslint-plugin-prettier': '',
    'eslint-config-prettier': '',
    'eslint-plugin-import': '',
  },
  typescript: {
    'eslint-import-resolver-typescript': '',
  },
}

const VUE_DEPS_MAP = Object.assign(
  {
    base: {
      'eslint-plugin-vue': '^7.6.0',
      '@vue/eslint-config-prettier': '^6.0.0',
    },
    typescript: {
      '@vue/eslint-config-typescript': '^7.0.0',
      '@typescript-eslint/eslint-plugin': '^4.15.1',
      '@typescript-eslint/parser': '^4.15.1',
    },
  },
  BASE_DEPS_MAP
)

const REACT_DEPS_MAP = Object.assign(
  {
    base: {
      'eslint-plugin-react': '',
      'eslint-plugin-react-hooks': '',
      'eslint-plugin-jsx-a11y': '',
    },
    typescript: {
      '@typescript-eslint/parser': '',
      '@typescript-eslint/eslint-plugin': '',
    },
  },
  BASE_DEPS_MAP
)

// exports.DEPS_MAP = DEPS_MAP
exports.BASE_DEPS_MAP = BASE_DEPS_MAP
exports.VUE_DEPS_MAP = VUE_DEPS_MAP
exports.REACT_DEPS_MAP = REACT_DEPS_MAP

exports.getDeps = function (api, preset) {
  const deps = {}
  if (!preset) {
    Object.assign(deps, BASE_DEPS_MAP.base)
    if (api.hasPlugin('typescript')) {
      Object.assign(deps, BASE_DEPS_MAP.typescript)
    }
    return deps
  }
  Object.assign(deps, [`${preset}_DEPS_MAP`].base)
  if (api.hasPlugin('typescript')) {
    Object.assign(deps, [`${preset}_DEPS_MAP`].typescript)
  }

  return deps
}
