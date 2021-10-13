exports.getPromptModules = () => {
  return ['devTemplate', 'typescript', 'cssPreprocessor', 'linter'].map(
    (prompt) => require(`./modules/${prompt}`)
  )
}
