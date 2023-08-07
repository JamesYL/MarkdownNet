import path from "path";
import { JsonSchema } from "@home/index";
import Ajv from "ajv";

interface DirectoryStructure {
  [key: string]: DirectoryStructure | Record<string, never>;
}

const addFilePathToDirectoryObject = (
  directoryObject: DirectoryStructure,
  filePathParts: string[],
): void => {
  let currentDir = directoryObject;
  filePathParts.forEach((part) => {
    if (!currentDir[part]) {
      currentDir[part] = {};
    }
    currentDir = currentDir[part] as DirectoryStructure;
  });
};

export const validateDirectoryStructure = (
  filePaths: string[],
  schema: JsonSchema,
): void => {
  const directoryObject: DirectoryStructure = {};
  filePaths.forEach((filePath) =>
    addFilePathToDirectoryObject(directoryObject, filePath.split(path.sep)),
  );
  const ajv = new Ajv({ allErrors: true, verbose: true }); // options can be passed, e.g. {allErrors: true}

  const validate = ajv.compile(JSON.parse(schema));
  const valid = validate(directoryObject);
  if (!valid)
    throw new Error(
      `JSON schema for directory structure failed: ${validate.errors}`,
    );
};
