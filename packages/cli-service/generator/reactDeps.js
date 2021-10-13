exports.getDeps = (api) => {
  const deps = {
    dependencies: {
      react: '^17.0.0',
      'react-dom': '^17.0.0',
    },
    devDependencies: {
      '@vitejs/plugin-react': '^1.0.0',
    },
  }
  if (api.hasPlugin('typescript')) {
    deps.devDependencies = Object.assign({}, deps.devDependencies, {
      '@types/react': '^17.0.0',
      '@types/react-dom': '^17.0.0',
    })
  }
  return deps
}
