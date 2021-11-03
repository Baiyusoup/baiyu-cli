const pluginRE = /^(@baiyusoup\/|baiyusoup-|@[\w-]+(\.)?[\w-]+\/baiyusoup-)cli-plugin-/;
const scopeRE = /^@[\w-]+(\.)?[\w-]+\//;
export function matchesPluginId(input: string, full: string) {
  const short = full.replace(pluginRE, '');
  return full === input || short === input || short === input.replace(scopeRE, '');
}
