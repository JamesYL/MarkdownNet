import { MarkdownContentWithMetadata } from "@engine/ingestor";
import {
  ValidateFlags,
  validateFilePaths,
  parseFrontMatter,
} from "./processor/validator";
import { ZodObject } from "zod";
import { FrontMatter } from "./ingestor/get_front_matter";
import { convertMarkdownPathsIntoWebPaths } from "./processor/transform_markdown_path";

const defaultValidateFlags: ValidateFlags = {
  validateEntryFiles: { entryFileName: "index.md" },
};

const defaultSettings: Settings = {
  validateFlags: defaultValidateFlags,
  webPathPrefix: "",
};

export interface Settings {
  validateFlags: ValidateFlags;
  webPathPrefix: string;
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
  validateFilePaths(filePaths, settings.validateFlags);

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
      );
      return {
        parsedFrontMatter,
        markdownWithWebPaths,
        fileLastModified,
      };
    },
  );
};
