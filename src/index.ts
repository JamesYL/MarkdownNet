import type { FrontMatterSchema, Settings, ProcessedData } from "./index.d";
import { getMarkdownContentWithMetadata } from "@engine/ingestor";
import { processMarkdownContent } from "@engine/processor";
import { ZodSchema } from "zod";

export const getDefaultSettings = (): Settings => {
  const defaultSettings: Settings = {
    webPathPrefix: "",
    entryFile: {
      name: "index.md",
      enforceDirectoryStructure: false,
    },
    directoryStructure: JSON.stringify({
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      additionalProperties: false,
    }),
  };
  return defaultSettings;
};

/**
 * @param directory An entry directory that contains all the markdown files
 * @param frontMatterSchema A zod schema that defines what front matter the markdown files should have
 * @param settings Optional configuration
 */
export const getMarkdownNet = <T = FrontMatterSchema>(
  directory: string,
  frontMatterSchema: ZodSchema<T>,
  settings?: Settings,
): ProcessedData<T>[] =>
  processMarkdownContent(
    getMarkdownContentWithMetadata(directory),
    frontMatterSchema,
    settings ?? getDefaultSettings(),
  );
