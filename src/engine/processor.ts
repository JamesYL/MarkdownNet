import { DirectoryStructure } from "./processor/validators/validate_directory_structure";
import { MarkdownContentWithMetadata } from "@engine/ingestor";
import { validateFilePaths, parseFrontMatter } from "./processor/validator";
import { ZodSchema } from "zod";
import { convertMarkdownPathsIntoWebPaths } from "./processor/transformer";
import transformerGenerator from "./processor/transformers/all_directories_populated_transformer";

const defaultSettings: Settings = {
  webPathPrefix: "",
  entryFileName: "index.md",
};

export interface Settings {
  webPathPrefix: string;
  entryFileName?: string;
}

export interface ProcessedData<T extends Record<string, string>> {
  parsedFrontMatter: T;
  markdownWithWebPaths: string;
  fileLastModified: Date;
  relativeFilePath: string;
}

export const processMarkdownContent = <
  FrontMatterSchema extends Record<string, string>,
>(
  content: MarkdownContentWithMetadata[],
  frontMatterSchema: ZodSchema<FrontMatterSchema>,
  settings: Settings = defaultSettings,
  directoryStructure?: DirectoryStructure,
): ProcessedData<FrontMatterSchema>[] => {
  const filePaths = content.map((item) => item.relativeFilePath);
  const filePathSet = new Set(filePaths);
  validateFilePaths(
    filePaths,
    { entryFileName: settings.entryFileName },
    directoryStructure,
  );

  return content.map(
    ({ frontMatter, markdownContent, fileLastModified, relativeFilePath }) => {
      const parsedFrontMatter = parseFrontMatter(
        frontMatter,
        frontMatterSchema,
      );

      const markdownWithWebPaths = convertMarkdownPathsIntoWebPaths(
        markdownContent,
        relativeFilePath,
        settings.webPathPrefix,
        filePathSet,
        transformerGenerator(settings.entryFileName ?? ""),
      );
      const res: ProcessedData<FrontMatterSchema> = {
        parsedFrontMatter,
        markdownWithWebPaths,
        relativeFilePath,
        fileLastModified,
      };
      return res;
    },
  );
};
