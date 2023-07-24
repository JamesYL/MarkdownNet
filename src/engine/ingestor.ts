import { getFrontMatter, FrontMatter } from "./ingestor/get_front_matter";
import { getFileContentInDirectory } from "./ingestor/get_file_content";
import path from "path";
import { extractMarkdownContent } from "./ingestor/get_markdown_content";

export type MarkdownContentWithMetadata<
  MandatoryFrontMatter extends string,
  OptionalFrontMatter extends string,
> = {
  markdownContent: string;
  frontMatter: FrontMatter<MandatoryFrontMatter, OptionalFrontMatter>;
  fileLastModified: Date;
  relativeFilePath: string;
};

/**
 * @param directory Directory containing markdown files
 * @param mandatoryFields Fields that must be present in the front matter - throws exception if not present
 */
export const getMarkdownContentWithMetadata = <
  MandatoryFrontMatter extends string,
  OptionalFrontMatter extends string,
>(
  directory: string,
  mandatoryFields: Set<MandatoryFrontMatter>,
): MarkdownContentWithMetadata<MandatoryFrontMatter, OptionalFrontMatter>[] => {
  const entryDirectory = path.resolve(__dirname, directory);
  const markdownContent = getFileContentInDirectory(entryDirectory);
  const results = markdownContent.map((content) => {
    const { fileContent, updatedDate, absoluteFilePath } = content;
    const frontMatter = getFrontMatter<
      MandatoryFrontMatter,
      OptionalFrontMatter
    >(fileContent, mandatoryFields);
    const markdownContent = extractMarkdownContent(fileContent);
    const relativeFilePath = path.relative(entryDirectory, absoluteFilePath);
    const markdownContentWithMetadata: MarkdownContentWithMetadata<
      MandatoryFrontMatter,
      OptionalFrontMatter
    > = {
      markdownContent,
      frontMatter,
      fileLastModified: updatedDate,
      relativeFilePath,
    };
    return markdownContentWithMetadata;
  });
  return results;
};
