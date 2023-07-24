import { ensureNoDuplicatePaths } from "./all_validators/ensure_no_duplicate_paths";
import { validateEntryFiles } from "./all_validators/validate_entry_files";
import { validateFilePathNames } from "./all_validators/validate_file_path_names";

export interface ValidateFlags {
  /** If enabled, ensures each directory has a file with the name `entryFileName` */
  validateEntryFiles?: {
    entryFileName: string;
  };
}

export const validateFilePaths = (
  filePaths: string[],
  settings: ValidateFlags,
): void => {
  // Cannot be disabled
  validateFilePathNames(filePaths);
  ensureNoDuplicatePaths(filePaths);

  // Custom validators
  if (settings.validateEntryFiles)
    validateEntryFiles(filePaths, settings.validateEntryFiles.entryFileName);
};
