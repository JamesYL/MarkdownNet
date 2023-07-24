import { frontMatterRegex } from "./get_front_matter";

export const extractMarkdownContent = (markdown: string): string => {
  const strippedFrontMatter = markdown.replace(frontMatterRegex, "");
  const trimmedMarkdown = strippedFrontMatter.trim();
  return trimmedMarkdown;
};
