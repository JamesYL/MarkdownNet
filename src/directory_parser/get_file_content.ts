import fs from "fs";
import path from "path";
import type { RawFileInfo } from "@home/index.d";

const getFileContentInDirectoryInternal = (
  directory: string,
  results: RawFileInfo[],
): void => {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFileContentInDirectoryInternal(filePath, results);
      return;
    }
    const ext = path.extname(filePath);
    if (ext.toLowerCase() !== ".md") return;

    const fileContent = fs.readFileSync(filePath, "utf8");
    const createdDate = fs.statSync(filePath).birthtime;
    const updatedDate = fs.statSync(filePath).mtime;

    results.push({
      fileContent,
      filePath,
      createdDate,
      updatedDate,
    });
  });
};

/**
 * Get all file content in the given directory, including any nested subdirectories.
 * Only files with the .md extension will be included.
 */
export const getFileContentInDirectory = (directory: string): RawFileInfo[] => {
  const results: RawFileInfo[] = [];
  getFileContentInDirectoryInternal(directory, results);
  return results;
};
