import slash from 'slash';

export function normalizeFilePath(files: Record<string, any>) {
  Object.keys(files).forEach((file) => {
    const normalized = slash(file);
    if (file !== normalized) {
      files[normalized] = files[file];
      delete files[file];
    }
  });
  return files;
}
