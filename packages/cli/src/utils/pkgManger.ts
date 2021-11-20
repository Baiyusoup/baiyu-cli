import { sync as commandExistsSync } from 'command-exists';

const promise: Promise<'npm' | 'yarn' | 'pnpm'> = new Promise((resolve) => {
  if (commandExistsSync('pnpm')) {
    return resolve('pnpm');
  } else if (commandExistsSync('yarn')) {
    return resolve('yarn');
  }
  return resolve('npm');
});

export default promise;
