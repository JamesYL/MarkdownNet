import type { ZodSchema } from "zod";

export type JsonSchema = string;
export type FrontMatter = Record<string, string | number>;
export type FrontMatterSchema<T = FrontMatter> = ZodSchema<T>;
export type EnvironmentVariables = Record<string, string>;
export type UriTransformer = (
  matchedUri: string,
  matchedContent: string,
  markdownFilePath: string,
  markdownFileContent: string,
) => {
  transformedUri: string;
  transformedContent: string;
} | null;
export interface RawFileInfo {
  fileContent: string;
  filePath: string;
  createdDate: Date;
  updatedDate: Date;
}
export interface ParsedMarkdown<T = FrontMatter> {
  frontMatter: T;
  markdownContent: string;
}
export interface Settings<T = FrontMatter> {
  /**
   * Enforces the file structure of the markdown files.
   * Each property in the JsonSchema should either be a dictionary of items, or an empty dictionary.
   * An empty dictionary means it's a file. Otherwise, it's a directory.
   */
  directoryStructure: JsonSchema;
  /**
   * Enforces front matter fields to follow the schema.
   */
  frontMatterSchema: FrontMatterSchema<T>;
  /**
   * Replaces all instances of $ENV_VAR_NAME_GOES_HERE with the mapped value in any of the links.
   */
  environmentVariables: EnvironmentVariables;
  /**
   * This appends to each local path referenced in the markdown files.
   */
  webPathPrefix: string;
  /**
   * The directory where the markdown files are located.
   */
  entryDirectory: string;
}
export interface MarkdownNetItem<T = FrontMatter> {
  frontMatter: T;
  markdownContent: string;
  filePath: string;
  updatedData: Date;
}

export interface NestedMarkdownNet<T = FrontMatter> {
  [key: string]: NestedMarkdownNet | MarkdownNetItem<T>;
}
