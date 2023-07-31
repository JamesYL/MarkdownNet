import { getMarkdownContentWithMetadata } from "@engine/ingestor";
import { processMarkdownContent } from "@engine/processor";
import { ZodSchema } from "zod";
export interface Settings {
  webPathPrefix: string;
  entryFileName?: string;
  directoryStructure?: DirectoryStructure;
}

export interface DirectoryStructure {
  [key: string]: DirectoryStructure | Record<string, never>;
}

export interface ProcessedData<T extends Record<string, unknown>> {
  parsedFrontMatter: T;
  markdownWithWebPaths: string;
  fileLastModified: Date;
  relativeFilePath: string;
}

export const getDefaultSettings = (): Settings => {
  const defaultSettings: Settings = {
    webPathPrefix: "",
    entryFileName: "index.md",
  };
  return defaultSettings;
};

/**
 * @param directory An entry directory that contains all the markdown files
 * @param frontMatterSchema A zod schema that defines what front matter the markdown files should have
 * @param settings Optional configuration
 */
export const getMarkdownNet = <
  FrontMatterSchema extends Record<string, string>,
>(
  directory: string,
  frontMatterSchema: ZodSchema<FrontMatterSchema>,
  settings?: Settings,
): ProcessedData<FrontMatterSchema>[] => {
  return processMarkdownContent(
    getMarkdownContentWithMetadata(directory),
    frontMatterSchema,
    settings ?? getDefaultSettings(),
  );
};
