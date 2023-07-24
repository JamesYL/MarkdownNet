import path from "path";

/*
 * This ensures each sub-directory has an entry file
 */
export const validateEntryFiles = (
  filePaths: string[],
  entryFileName: string,
): void => {
  const filePathsSet = new Set(filePaths);
  const directories = new Set(
    filePaths.flatMap((item) => {
      const parentDirectories: string[] = [];
      let parentDir = path.dirname(item);
      while (parentDir !== "." && parentDir !== "/") {
        parentDirectories.push(parentDir);
        parentDir = path.dirname(parentDir);
      }
      return parentDirectories;
    }),
  );
  directories.add(".");
  for (const dir of directories) {
    const entryFilePath = path.join(dir, entryFileName);
    if (filePathsSet.has(entryFilePath)) continue;
    throw new Error(
      `Missing >>>${entryFileName}<<< file in directory >>>${dir}<<<`,
    );
  }
};