import path from "path";

const isWebPath = (filePath: string): boolean => {
  filePath = filePath.toLowerCase().trim(); // Web paths should be case insensitive
  return (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://") ||
    filePath.startsWith("www.") ||
    filePath.startsWith("mailto:")
  );
};

export const isLocalPath = (filePath: string): boolean =>
  filePath.startsWith(".");

export type Transformer = (
  localMatchedPath: string,
  markdownFileEntryPath: string,
  allFilePaths: Set<string>,
) => string;

/**
 * Converts all local file paths found in markdown files into web paths.
 * @param markdownContent Something like "# Title \nThis is a [test](./file.md)"
 * @param relativeMarkdownFilePath Where the markdown file is located, like "path/to/file.md"
 * @param webPathPrefix This is appened to the resolved path prefix
 * @returns The updated markdown with any links pointing from local files to absolute web paths, with the newFilePathPrefix appended
 */
export const convertMarkdownPathsIntoWebPaths = (
  markdownContent: string,
  relativeMarkdownFilePath: string,
  webPathPrefix: string,
  allFilePaths: Set<string>,
  transformer: Transformer,
): string => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return markdownContent.replace(
    linkRegex,
    (fullMatch: string, title: string, matchedPath: string) => {
      if (isWebPath(matchedPath)) return fullMatch;
      if (!isLocalPath(matchedPath))
        throw new Error(
          `Invalid path found for match >>>${fullMatch}<<< and for the file >>>${relativeMarkdownFilePath}<<<`,
        );
      if (matchedPath.startsWith("/"))
        throw new Error("Local file path must be relative");

      const transformedPath = transformer(
        matchedPath,
        relativeMarkdownFilePath,
        allFilePaths,
      );

      let fullPath = path.join(
        "/",
        webPathPrefix,
        path.join("/", transformedPath),
      );
      if (fullPath !== "/" && fullPath.endsWith("/"))
        fullPath = fullPath.slice(0, -1);
      return `[${title}](${fullPath})`;
    },
  );
};
