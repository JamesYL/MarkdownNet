import { MarkdownContentWithMetadata } from "@engine/ingestor";
import { validateFilePaths, parseFrontMatter } from "./processor/validator";
import { ZodSchema } from "zod";
import { convertMarkdownPathsIntoWebPaths } from "./processor/transform_markdown_path";
import transformerGenerator from "./processor/transformers/all_directories_populated_transformer";

const defaultSettings: Settings = {
  webPathPrefix: "",
  entryFileName: "index.md",
};

export interface Settings {
  webPathPrefix: string;
  entryFileName?: string;
}

export interface ProcessedData<T extends object> {
  parsedFrontMatter: T;
  markdownWithWebPaths: string;
  fileLastModified: Date;
}

export const processMarkdownContent = <T extends object>(
  content: MarkdownContentWithMetadata<string, string>[],
  settings: Settings = defaultSettings,
  zodSchema: ZodSchema<T>,
): ProcessedData<T>[] => {
  const filePaths = content.map((item) => item.relativeFilePath);
  const filePathSet = new Set(filePaths);
  validateFilePaths(filePaths, { entryFileName: settings.entryFileName });

  return content.map(
    ({ frontMatter, markdownContent, fileLastModified, relativeFilePath }) => {
      const parsedFrontMatter = parseFrontMatter(frontMatter, zodSchema);

      const markdownWithWebPaths = convertMarkdownPathsIntoWebPaths(
        markdownContent,
        relativeFilePath,
        settings.webPathPrefix,
        filePathSet,
        transformerGenerator(settings.entryFileName ?? ""),
      );
      return {
        parsedFrontMatter,
        markdownWithWebPaths,
        fileLastModified,
      };
    },
  );
};
