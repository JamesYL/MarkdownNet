import type { FrontMatter, FrontMatterSchema } from "@home/index.d";

const frontMatterRegex = /^[\s\n]*---\s*\n([\s\S]+)\n\s*---/;

const getFrontMatter = (rawMarkdownContent: string): FrontMatter => {
  const match = rawMarkdownContent.match(frontMatterRegex);
  if (match === null) return {} as FrontMatter;

  const frontMatterString = match[1];

  // Parse colon-separated fields
  const fields: Record<string, string> = {};
  frontMatterString.split("\n").map((line) => {
    const index = line.indexOf(":");
    if (index === -1)
      throw new Error(`Front matter line missing colon: >>>${line}<<<`);
    const fieldName = line.slice(0, index).trim();
    const fieldValue = line.slice(index + 1).trim();

    if (fieldName in fields) throw new Error("Duplicate field name");

    fields[fieldName] = fieldValue;
  });

  return fields;
};

const extractMarkdownContent = (rawMarkdownContent: string): string => {
  return rawMarkdownContent
    .replace(frontMatterRegex, "")
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
};

export const extractFrontMatterAndContent = <T = FrontMatter>(
  rawMarkdownContent: string,
  frontMatterSchema: FrontMatterSchema<T>,
): { frontMatter: T; markdownContent: string } => {
  const frontMatter = frontMatterSchema.parse(
    getFrontMatter(rawMarkdownContent),
  );
  const markdownContent = extractMarkdownContent(rawMarkdownContent);
  return { frontMatter, markdownContent };
};
