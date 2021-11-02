export function clearConsole() {
  process.stdout.write('\x1b[2J');
  process.stdout.write('\x1b[0f');
}

export function log(message?: string) {
  console.log(message);
}
