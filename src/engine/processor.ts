import { MarkdownContentWithMetadata } from "@engine/ingestor";
import { ValidateFlags, validateFilePaths } from "./processor/validator";

const defaultValidateFlags: ValidateFlags = {
  validateEntryFiles: { entryFileName: "index.md" },
};

export const processMarkdownContent = <
  MandatoryFrontMatter extends string,
  OptionalFrontMatter extends string,
>(
  content: MarkdownContentWithMetadata<
    MandatoryFrontMatter,
    OptionalFrontMatter
  >[],
  validateSettings: ValidateFlags = defaultValidateFlags,
): number => {
  const filePaths = content.map((item) => item.relativeFilePath);
  validateFilePaths(filePaths, validateSettings);

  return content;
};
