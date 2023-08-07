import type { ZodSchema } from "zod";

export type JsonSchema = string;
export type FrontMatterSchema = Record<string, string | number>;

export interface Settings {
  /**
   * This appends to each local path referenced in the markdown files.
   */
  webPathPrefix: string;
  /**
   * If defined, it means each directory must have a file with this name.
   */
  entryFileName?: string;
  /**
   * If defined, it enforces the file structure.
   * Each property in the JsonSchema should either be a dictionary of items, or an empty dictionary.
   */
  directoryStructure?: JsonSchema;
}

export interface ProcessedData<T = FrontMatterSchema> {
  parsedFrontMatter: T;
  markdownWithWebPaths: string;
  fileLastModified: Date;
  relativeFilePath: string;
}

export function getDefaultSettings(): Settings;

/**
 * @param directory An entry directory that contains all the markdown files
 * @param frontMatterSchema A zod schema that defines what front matter the markdown files should have
 * @param settings Optional configuration
 */
export function getMarkdownNet<T = FrontMatterSchema>(
  directory: string,
  frontMatterSchema: ZodSchema<T>,
  settings?: Settings,
): ProcessedData<T>[];
