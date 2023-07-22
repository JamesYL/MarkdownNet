import fs from "fs";
import matter from "gray-matter";
import path from "path";
import os from "os";
import { DocObject } from "./types";
import { validateData } from "./validators";
import { parseContent, getWebPath } from "./content_parser";

const entryDirectory = path.join(
  os.homedir(),
  "cshelp",
  "transformer",
  "webapp-docs",
  "data"
);
const outputDirectory = path.join(
  os.homedir(),
  "cshelp",
  "transformer",
  "webapp-docs"
);

const supportedFileTypes = [".md", ".tex"];
const skippedFileTypes = [".pdf"];

/**
 * @param dir Entry directory
 * @param skipIndexMD Directories to skip the check to see if there's an index.md file
 */
const getFilesInDirectory = (dir: string, skipIndexMD: string[]) => {
  const files = fs.readdirSync(dir);
  const fileObjects: Record<string, DocObject> = {};
  if (!files.includes("index.md") && !skipIndexMD.includes(dir))
    throw new Error(`Missing index.md for directory ${dir}`);

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      console.log(`\nDirectory found: ${filePath}`);
      const subdirectoryObjects = getFilesInDirectory(filePath, skipIndexMD); // recursively add files in subdirectories
      for (const [path, doc] of Object.entries(subdirectoryObjects)) {
        if (path in fileObjects) {
          throw new Error("Duplicate parsed path");
        }
        fileObjects[path] = doc;
      }
    } else {
      const ext = path.extname(filePath);
      if (skippedFileTypes.includes(ext)) {
        console.warn("\x1b[33m Skipping " + file + "\x1b[0m");
        return;
      }
      if (!supportedFileTypes.includes(ext))
        throw new Error(`Unsupported file extension: ${ext}`);

      console.log(`Processing file: ${filePath}`);

      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      const metadata = validateData(data, ext);
      const createdDate = fs.statSync(filePath).birthtime;
      const updatedDate = fs.statSync(filePath).mtime;
      const parsedPath = getWebPath(entryDirectory, filePath);
      const docObject: DocObject = {
        ...metadata,
        content: parseContent(content, ext, entryDirectory, filePath),
        createdDate,
        updatedDate,
        path: parsedPath,
        fileType: ext,
      };

      if (parsedPath in fileObjects) {
        throw new Error("Duplicate parsed path");
      }
      fileObjects[parsedPath] = docObject;
    }
  });

  return fileObjects;
};

export { entryDirectory, outputDirectory, getFilesInDirectory };
