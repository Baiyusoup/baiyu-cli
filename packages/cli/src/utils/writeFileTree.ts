import path from 'path';
import fs from 'fs-extra';

function deleteRemoveFiles(
  dir: string,
  newFiles: Record<string, any>,
  prevFiles: Record<string, any>,
) {
  const filesToDelete = Object.keys(prevFiles).filter((filename) => !newFiles[filename]);

  return Promise.all(
    filesToDelete.map((filename) => {
      return fs.unlink(path.join(dir, filename));
    }),
  );
}

export default async function (
  dir: string,
  files: Record<string, any>,
  preFiles?: Record<string, any>,
) {
  if (preFiles) {
    await deleteRemoveFiles(dir, files, preFiles);
  }

  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[name]);
  });
}
