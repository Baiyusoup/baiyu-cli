import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import validateProjectName from 'validate-npm-package-name';
import Creator from '../Creator';
import resolvePreset from '../presetPrompt';
import type { InitOptions } from '../types';

async function create(options: InitOptions) {
  const { projectName } = options;
  const validationResult = validateProjectName(projectName);

  if (!validationResult.validForNewPackages) {
    console.error(`Invalidate projectName: ${projectName}`);
    validationResult.errors && validationResult.errors.forEach((err) => console.error(err));
    validationResult.warnings && validationResult.warnings.forEach((warn) => console.warn(warn));
  }
  const context = process.cwd();
  const projectDir = path.resolve(context, projectName);
  if (fs.existsSync(projectDir)) {
    console.log('The project directory is existing!');
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: 'Does you want to do ?',
        choices: [
          { name: '覆盖', value: 'overwrite' },
          { name: '终止', value: 'cancel' },
        ],
      },
    ]);
    if (action === 'overwrite') {
      console.log(`\nRemoving ${projectDir}...`);
      await fs.remove(projectDir);
    } else {
      console.log('You cancel created project!');
      return;
    }
  }

  const creator = new Creator(projectName, projectDir, resolvePreset());
  await creator.start();
}

export default async function (options: InitOptions) {
  try {
    return create(options);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
