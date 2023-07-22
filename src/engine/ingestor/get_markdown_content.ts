import fs from "fs";
import path from "path";
import { logger } from "../../platform/logger";

export interface Content {
  content: string;
  absoluteFilePath: string;
  createdDate: Date;
  updatedDate: Date;
}

/**
 * Will push to the results array all markdown content in the given directory.
 */
export const getMarkdownContentInDirectory = (directory: string): Content[] => {
  const results: Content[] = [];
  getMarkdownContentInDirectoryInternal(directory, results);
  return results;
};
export const getMarkdownContentInDirectoryInternal = (
  directory: string,
  results: Content[],
): void => {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const absoluteFilePath = path.join(directory, file);
    if (fs.statSync(absoluteFilePath).isDirectory()) {
      getMarkdownContentInDirectoryInternal(absoluteFilePath, results);
      return;
    }
    const ext = path.extname(absoluteFilePath);
    if (ext.toLowerCase() !== ".md") {
      logger.error(
        `Found non-markdown file in data directory: ${absoluteFilePath}`,
      );
      return;
    }

    const content = fs.readFileSync(absoluteFilePath, "utf8");
    const createdDate = fs.statSync(absoluteFilePath).birthtime;
    const updatedDate = fs.statSync(absoluteFilePath).mtime;

    results.push({
      content,
      absoluteFilePath,
      createdDate,
      updatedDate,
    });
  });
};

logger.info(getMarkdownContentInDirectory(path.join(__dirname, "../tmp")));
