import path from "path";

/**
 * This ensures the path follows snakecase naming scheme
 */
export const validateFilePathNames = (filePaths: string[]): void => {
  filePaths.forEach((filePath) => {
    if (filePath.toLowerCase() !== filePath)
      throw new Error(`All files must be lowercase: >>>${filePath}<<<`);

    const parts = filePath.split(path.sep);
    const fileName = parts[parts.length - 1];
    const directories = parts.slice(0, -1);

    const fileNameRegexString = "^[a-z0-9_]+(\\.[a-z]+)?$";
    const directoryRegexString = "^[a-z0-9_]+$";

    if (!new RegExp(fileNameRegexString).test(fileName)) {
      throw new Error(
        `File name must follows this regex ${fileNameRegexString} : >>>${filePath}<<<`,
      );
    }

    for (const part of directories)
      if (!new RegExp(directoryRegexString).test(part))
        throw new Error(
          `Directory name must follow this regex ${directoryRegexString} : >>>${filePath}<<<`,
        );
  });
};
