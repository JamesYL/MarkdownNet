import { MarkdownContentWithMetadata } from "@engine/ingestor/ingestor";
import { validateFilePaths } from "./services/validator";

export const processMarkdownContent = <
  MandatoryFrontMatter extends string,
  OptionalFrontMatter extends string,
>(
  content: MarkdownContentWithMetadata<
    MandatoryFrontMatter,
    OptionalFrontMatter
  >[],
): number => {
  const filePaths = content.map((item) => item.relativeFilePath);
  validateFilePaths(filePaths);

  

  return content;
};
