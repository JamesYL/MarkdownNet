import fs from "fs";
import path from "path";

export interface Content {
  fileContent: string;
  absoluteFilePath: string;
  createdDate: Date;
  updatedDate: Date;
}

/**
 * Get all file content in the given directory, including any nested subdirectories.
 * Only files with the .md extension will be included.
 */
export const getFileContentInDirectory = (directory: string): Content[] => {
  const results: Content[] = [];
  getFileContentInDirectoryInternal(directory, results);
  return results;
};

const getFileContentInDirectoryInternal = (
  directory: string,
  results: Content[],
): void => {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const absoluteFilePath = path.join(directory, file);
    if (fs.statSync(absoluteFilePath).isDirectory()) {
      getFileContentInDirectoryInternal(absoluteFilePath, results);
      return;
    }
    const ext = path.extname(absoluteFilePath);
    if (ext.toLowerCase() !== ".md") return;

    const fileContent = fs.readFileSync(absoluteFilePath, "utf8");
    const createdDate = fs.statSync(absoluteFilePath).birthtime;
    const updatedDate = fs.statSync(absoluteFilePath).mtime;

    results.push({
      fileContent,
      absoluteFilePath,
      createdDate,
      updatedDate,
    });
  });
};
