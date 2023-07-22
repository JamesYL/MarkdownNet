import { getFilesInDirectory } from "./file_utils";
import path from "path";
import os from "os";
import fs from "fs";
const entryDirectory = path.join(
  os.homedir(),
  "cshelp",
  "transformer",
  "webapp-docs",
  "data",
);
const skipDirectories = [path.join(entryDirectory, "static"), entryDirectory];

const outputDirectory = path.join(
  os.homedir(),
  "cshelp",
  "transformer",
  "webapp-docs",
);

const fileObjects = getFilesInDirectory(entryDirectory, skipDirectories);

fs.writeFileSync(
  path.join(outputDirectory, "docs.ts"),
  `
export interface OutputData {
  title: string;
  desc: string;
  priority: number;
  content: string;
  /** In UTC */
  createdDate: string;
  /** In UTC */
  updatedDate: string;
  path: string;
  fileType: string;
}
export const data: { [path: string]: OutputData } =
${JSON.stringify(fileObjects, null, 2)};`,
);
console.log(`\nOutput file created: ${path.join(outputDirectory, "docs.ts")}`);
