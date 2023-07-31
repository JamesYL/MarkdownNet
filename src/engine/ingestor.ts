import { getFrontMatter, FrontMatter } from "./ingestor/get_front_matter";
import { getFileContentInDirectory } from "./ingestor/get_file_content";
import path from "path";
import { extractMarkdownContent } from "./ingestor/get_markdown_content";

export type MarkdownContentWithMetadata = {
  markdownContent: string;
  frontMatter: FrontMatter;
  fileLastModified: Date;
  relativeFilePath: string;
};

/**
 * @param directory Directory containing markdown files
 * @param mandatoryFields Fields that must be present in the front matter - throws exception if not present
 */
export const getMarkdownContentWithMetadata = (
  directory: string,
): MarkdownContentWithMetadata[] => {
  const entryDirectory = path.resolve(__dirname, directory);
  const markdownContent = getFileContentInDirectory(entryDirectory);
  const results = markdownContent.map((content) => {
    const { fileContent, updatedDate, absoluteFilePath } = content;
    const frontMatter = getFrontMatter(fileContent);
    const markdownContent = extractMarkdownContent(fileContent);
    const relativeFilePath = path.relative(entryDirectory, absoluteFilePath);
    const markdownContentWithMetadata: MarkdownContentWithMetadata = {
      markdownContent,
      frontMatter,
      fileLastModified: updatedDate,
      relativeFilePath,
    };
    return markdownContentWithMetadata;
  });
  return results;
};
