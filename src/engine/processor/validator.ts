import { FrontMatter } from "@engine/ingestor/get_front_matter";
import { ensureNoDuplicatePaths } from "./validators/ensure_no_duplicate_paths";
import { validateEntryFiles } from "./validators/validate_entry_files";
import { ZodSchema } from "zod";
import { validateDirectoryStructure } from "./validators/validate_directory_structure";
import { FrontMatterSchema, JsonSchema } from "@home/index.d";

export interface ValidateFlags {
  entryFileName?: string;
}

export const validateFilePaths = (
  filePaths: string[],
  settings: ValidateFlags,
  directoryStructure?: JsonSchema,
): void => {
  ensureNoDuplicatePaths(filePaths);

  // Ensure that all directories have an entry file
  if (settings.entryFileName)
    validateEntryFiles(filePaths, settings.entryFileName);

  // Ensure the file paths follow a certain directory structure
  if (directoryStructure)
    validateDirectoryStructure(filePaths, directoryStructure);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const parseFrontMatter = <T = FrontMatterSchema>(
  frontMatter: FrontMatter,
  schema: ZodSchema<T>,
): T => {
  return schema.parse(frontMatter);
};
