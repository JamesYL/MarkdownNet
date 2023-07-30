import path from "path";
import { fileNameRegexString } from "./validate_file_path_names";

/*
 * This ensures each sub-directory has an entry file
 */
export const validateEntryFiles = (
  filePaths: string[],
  entryFileName: string,
): void => {
  if (!new RegExp(fileNameRegexString).test(entryFileName))
    throw new Error(
      `Entry file name must follows this regex ${fileNameRegexString} : >>>${entryFileName}<<<`,
    );

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
