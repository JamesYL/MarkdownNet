export const ensureNoDuplicatePaths = (filePaths: string[]): void => {
  const filePathsSet = new Set(filePaths);
  if (filePathsSet.size !== filePaths.length)
    throw new Error("Duplicate file paths detected");
};
