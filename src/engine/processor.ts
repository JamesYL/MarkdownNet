import { MarkdownContentWithMetadata } from "@engine/ingestor";
import { validateFilePaths, parseFrontMatter } from "./processor/validator";
import { ZodObject } from "zod";
import { FrontMatter } from "./ingestor/get_front_matter";
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

export interface ProcessedData<
  MandatoryFrontMatter extends string,
  OptionalFrontMatter extends string,
> {
  parsedFrontMatter: FrontMatter<MandatoryFrontMatter, OptionalFrontMatter>;
  markdownWithWebPaths: string;
  fileLastModified: Date;
}

export const processMarkdownContent = <
  MandatoryFrontMatter extends string,
  OptionalFrontMatter extends string,
>(
  content: MarkdownContentWithMetadata<
    MandatoryFrontMatter,
    OptionalFrontMatter
  >[],
  settings: Settings = defaultSettings,
  frontMatterSchema: ZodObject<
    FrontMatter<MandatoryFrontMatter, OptionalFrontMatter>
  >,
): ProcessedData<MandatoryFrontMatter, OptionalFrontMatter>[] => {
  const filePaths = content.map((item) => item.relativeFilePath);
  const filePathSet = new Set(filePaths);
  validateFilePaths(filePaths, { entryFileName: settings.entryFileName });

  return content.map(
    ({ frontMatter, markdownContent, fileLastModified, relativeFilePath }) => {
      const parsedFrontMatter = parseFrontMatter<
        MandatoryFrontMatter,
        OptionalFrontMatter
      >(frontMatter, frontMatterSchema);

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
