exports.getDeps = (api) => {
  const deps = {
    dependencies: {
      vue: '^3.2.13',
    },
    devDependencies: {
      '@vitejs/plugin-vue': '^1.9.0',
    },
  }
  if (api.hasPlugin('typescript')) {
    deps.devDependencies['vue-tsc'] = '^0.3.0'
  }
  return deps
}
