export default function () {
  return ['templates', 'css', 'lint'].map(async (prompt) => await import(`./presets/${prompt}`))

}
