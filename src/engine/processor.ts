import { Settings, FrontMatterSchema, ProcessedData } from "@home/index.d";
import { MarkdownContentWithMetadata } from "@engine/ingestor";
import { validateFilePaths, parseFrontMatter } from "./processor/validator";
import { ZodSchema } from "zod";
import { convertMarkdownPathsIntoWebPaths } from "./processor/transformer";
import transformerGenerator from "./processor/transformers/all_directories_populated_transformer";

export const processMarkdownContent = <T = FrontMatterSchema>(
  content: MarkdownContentWithMetadata[],
  frontMatterSchema: ZodSchema<T>,
  settings: Settings,
): ProcessedData<T>[] => {
  const filePaths = content.map((item) => item.relativeFilePath);
  const filePathSet = new Set(filePaths);
  validateFilePaths(
    filePaths,
    {
      entryFileName: settings.entryFile.enforceDirectoryStructure
        ? settings.entryFile.name
        : "",
    },
    settings.directoryStructure,
  );

  return content.map(
    ({ frontMatter, markdownContent, fileLastModified, relativeFilePath }) => {
      const parsedFrontMatter: T = parseFrontMatter(
        frontMatter,
        frontMatterSchema,
      );

      const markdownWithWebPaths = convertMarkdownPathsIntoWebPaths(
        markdownContent,
        relativeFilePath,
        settings.webPathPrefix,
        filePathSet,
        transformerGenerator(settings.entryFile.name),
      );
      const res: ProcessedData<T> = {
        parsedFrontMatter,
        markdownWithWebPaths,
        relativeFilePath,
        fileLastModified,
      };
      return res;
    },
  );
};
