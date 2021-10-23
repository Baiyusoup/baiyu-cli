exports.getDeps = (rootOptions) => {
  const existingPreProcessor = rootOptions.cssPreprocessor
  const deps = {
    stylelint: '^13.13.1',
    'stylelint-config-prettier': '^8.0.2',
    'stylelint-config-rational-order': '^0.1.2',
    'stylelint-config-standard': '^22.0.0',
    'stylelint-declaration-block-no-ignored-properties': '^2.4.0',
    'stylelint-order': '^4.1.0',
    'stylelint-prettier': '^1.2.0',
  }
  if (existingPreProcessor) {
    switch (existingPreProcessor) {
      case 'sass':
        deps['sass'] = '^1.32.7'
        deps['stylelint-scss'] = '^3.21.0'
        break
      case 'less':
        deps['less'] = '^4.0.0'
        deps['stylelint-less'] = '^1.0.1'
        break
    }
  }
  return deps
}
