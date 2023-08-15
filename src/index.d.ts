import type { ZodSchema } from "zod";

export type JsonSchema = string;
export type FrontMatterSchema = Record<string, string | number>;

export interface Settings {
  /**
   * This appends to each local path referenced in the markdown files.
   */
  webPathPrefix: string;
  /**
   * This is related to mapping a specific file in a directory to represent the directory. For example, something like index.md.
   * If the name is defined, then the paths in the markdown file will route to the parent directory when the name is matched.
   */
  entryFile: {
    /**
     * A file name to represent the directory, such as `index.md`.
     * If no file is wanted, then use the empty string.
     */
    name: string;
    /**
     * Enforces every directory has the entry file.
     */
    enforceDirectoryStructure: boolean;
  };
  /**
   * If defined, it enforces the file structure.
   * Each property in the JsonSchema should either be a dictionary of items, or an empty dictionary.
   */
  directoryStructure: JsonSchema;
}

export type FrontMatterSchema = Record<string, string | number>;

export interface ProcessedData<T = FrontMatterSchema> {
  parsedFrontMatter: T;
  markdownWithWebPaths: string;
  fileLastModified: Date;
  relativeFilePath: string;
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
  frontMatterSchema: ZodSchema,
  settings?: Settings,
): ProcessedData<T>[];
