import path from "path";

/**
 * This ensures each sub-directory has an entry file
 */
export const validateEntryFiles = (
  filePaths: string[],
  entryFileName = "index.md",
): void => {
  const nonLowerCaseFiles = filePaths.filter(
    (item) => path.extname(item) !== path.extname(item).toLowerCase(),
  );
  if (nonLowerCaseFiles.length > 0) {
    throw new Error(
      `All file extensions must be lowercase: >>>${nonLowerCaseFiles.join(
        ", ",
      )}<<<`,
    );
  }

  const filePathsSet = new Set(filePaths);
  const directories = new Set(filePaths.map((item) => path.join(item, "..")));
  for (const dir of directories) {
    const entryIndexFilePath = path.join(dir, entryFileName);
    if (!(entryIndexFilePath in filePathsSet)) {
      throw new Error(
        `Missing >>>${entryFileName}<<< file in directory ${dir}`,
      );
    }
  }
};

/**
 * This ensures the path follows snakecase naming scheme
 */
export const validateFilePathNames = (filePaths: string[]): void => {
  filePaths.forEach((filePath) => {
    if (filePath.toLowerCase() !== filePath)
      throw new Error(`All files must be lowercase: >>>${filePath}<<<`);

    const parts = filePath.split(path.sep);

    for (const part of parts) {
      if (!/^[a-z0-9_]+$/.test(part)) {
        throw new Error(`All file names must be snake_case: >>>${filePath}<<<`);
      }
    }
  });
};

export const ensureNoDuplicatePaths = (filePaths: string[]): void => {
  const filePathsSet = new Set(filePaths);
  if (filePathsSet.size !== filePaths.length)
    throw new Error("Duplicate file paths detected");
};
