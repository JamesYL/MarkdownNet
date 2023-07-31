import { MarkdownContentWithMetadata } from "@engine/ingestor";
import { validateFilePaths, parseFrontMatter } from "./processor/validator";
import { ZodSchema } from "zod";
import { convertMarkdownPathsIntoWebPaths } from "./processor/transformer";
import transformerGenerator from "./processor/transformers/all_directories_populated_transformer";
import { ProcessedData, Settings } from "src";

export const processMarkdownContent = <
  FrontMatterSchema extends Record<string, string>,
>(
  content: MarkdownContentWithMetadata[],
  frontMatterSchema: ZodSchema<FrontMatterSchema>,
  settings: Settings,
): ProcessedData<FrontMatterSchema>[] => {
  const filePaths = content.map((item) => item.relativeFilePath);
  const filePathSet = new Set(filePaths);
  validateFilePaths(
    filePaths,
    { entryFileName: settings.entryFileName },
    settings.directoryStructure,
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
