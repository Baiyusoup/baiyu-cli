export function clearConsole() {
  process.stdout.write('\x1b[2J');
  process.stdout.write('\x1b[0f');
}

export function log(message: string = '') {
  console.log(message);
}

export function error(message: string) {
  console.error(message);
}

export function warn(message: string) {
  console.warn(message);
}
