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

const isLocalPath = (filePath: string): boolean => filePath.startsWith(".");

export const convertMarkdownPathsIntoWebPaths = (
  markdownContent: string,
  relativeMarkdownFilePath: string,
  newFilePathPrefix: string,
  entryFile?: string,
): string => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return markdownContent.replace(
    linkRegex,
    (fullMatch: string, title: string, matchedUri: string) => {
      if (isWebPath(matchedUri)) return fullMatch;
      if (isLocalPath(matchedUri)) {
        let fullPath = path.join(
          "/",
          newFilePathPrefix,
          relativeMarkdownFilePath,
          matchedUri,
        );
        if (entryFile && fullPath.endsWith(`/${entryFile}`))
          fullPath = path.dirname(fullPath);
        return `[${title}](${fullPath})`;
      }
      throw new Error(
        `Invalid path found for match >>>${fullMatch}<<< and for the file >>>${relativeMarkdownFilePath}<<<`,
      );
    },
  );
};
