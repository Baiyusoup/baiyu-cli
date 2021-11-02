import { sync as commandExistsSync } from 'command-exists';

const promise: Promise<'npm' | 'yarn'> = new Promise((resolve) => {
  if (commandExistsSync('yarn')) return resolve('yarn');
  return resolve('npm');
});

export default promise;
