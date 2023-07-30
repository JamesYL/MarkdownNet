import { FrontMatter } from "@engine/ingestor/get_front_matter";
import { ensureNoDuplicatePaths } from "./validators/ensure_no_duplicate_paths";
import { validateEntryFiles } from "./validators/validate_entry_files";
import { validateFilePathNames } from "./validators/validate_file_path_names";
import { ZodSchema } from "zod";
import {
  DirectoryStructure,
  validateDirectoryStructure,
} from "./validators/validate_directory_structure";

export interface ValidateFlags {
  entryFileName?: string;
}

export const validateFilePaths = (
  filePaths: string[],
  settings: ValidateFlags,
  directoryStructure?: DirectoryStructure,
): void => {
  // Cannot be disabled
  validateFilePathNames(filePaths);
  ensureNoDuplicatePaths(filePaths);

  // Ensure that all directories have an entry file
  if (settings.entryFileName)
    validateEntryFiles(filePaths, settings.entryFileName);

  // Ensure the file paths follow a certain directory structure
  if (directoryStructure)
    validateDirectoryStructure(filePaths, directoryStructure);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const parseFrontMatter = <T extends Record<string, string>>(
  frontMatter: FrontMatter<string, string>,
  schema: ZodSchema<T>,
): T => {
  return schema.parse(frontMatter);
};
