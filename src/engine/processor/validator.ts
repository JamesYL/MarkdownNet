import { FrontMatter } from "@engine/ingestor/get_front_matter";
import { ensureNoDuplicatePaths } from "./validators/ensure_no_duplicate_paths";
import { validateEntryFiles } from "./validators/validate_entry_files";
import { validateFilePathNames } from "./validators/validate_file_path_names";
import { ZodSchema } from "zod";

export interface ValidateFlags {
  entryFileName?: string;
}

export const validateFilePaths = (
  filePaths: string[],
  settings: ValidateFlags,
): void => {
  // Cannot be disabled
  validateFilePathNames(filePaths);
  ensureNoDuplicatePaths(filePaths);

  // Custom validators
  if (settings.entryFileName)
    validateEntryFiles(filePaths, settings.entryFileName);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const parseFrontMatter = <T extends object>(
  frontMatter: FrontMatter<string, string>,
  schema: ZodSchema<T>,
): T => {
  return schema.parse(frontMatter);
};
