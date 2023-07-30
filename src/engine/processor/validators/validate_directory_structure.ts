import path from "path";

export interface DirectoryStructure {
  [key: string]: DirectoryStructure | Record<string, never>;
}

const deepEquals = (
  obj1: DirectoryStructure,
  obj2: DirectoryStructure,
): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  return !keys1.some(
    (key) => !(key in obj2) || !deepEquals(obj1[key], obj2[key]),
  );
};

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
  schema: DirectoryStructure,
): void => {
  const directoryObject: DirectoryStructure = {};

  filePaths.forEach((filePath) =>
    addFilePathToDirectoryObject(directoryObject, filePath.split(path.sep)),
  );
  if (!deepEquals(directoryObject, schema))
    throw new Error("Directory structure does not match schema");
};
