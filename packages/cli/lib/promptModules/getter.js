exports.getPromptModules = () => {
  return ['devTemplate', 'typescript', 'cssPreprocessor', 'linter', 'unit'].map(
    (prompt) => require(`./modules/${prompt}`)
  )
}
