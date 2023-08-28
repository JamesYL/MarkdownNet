import type { FrontMatter, JsonSchema, Settings } from "@home/index.d";
import path from "path";
import Ajv from "ajv";

const validateDirectoryStructure = (
  filePaths: string[],
  schema: JsonSchema,
): void => {
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
  const directoryObject: DirectoryStructure = {};
  filePaths.forEach((filePath) =>
    addFilePathToDirectoryObject(directoryObject, filePath.split(path.sep)),
  );
  const ajv = new Ajv({ allErrors: true, verbose: true }); // options can be passed, e.g. {allErrors: true}

  const validate = ajv.compile(JSON.parse(schema));
  const valid = validate(directoryObject);
  if (!valid)
    throw new Error(
      `JSON schema for directory structure failed: ${JSON.stringify(
        validate.errors,
        null,
        2,
      )}`,
    );
};

export const validateFilePaths = <T = FrontMatter>(
  filePaths: string[],
  settings: Settings<T>,
): void => {
  const filePathsSet = new Set(filePaths);
  if (filePathsSet.size !== filePaths.length)
    throw new Error("INTERNAL ERROR: Duplicate file paths detected");

  validateDirectoryStructure(filePaths, settings.directoryStructure);
};
