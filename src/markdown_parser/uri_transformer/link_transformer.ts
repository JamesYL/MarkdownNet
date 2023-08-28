import type { UriTransformer } from "@home/index.d";
import path from "path";

const isWebPath = (filePath: string): boolean => {
  filePath = filePath.toLowerCase().trim(); // Web paths should be case insensitive
  return (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://") ||
    filePath.startsWith("www.") ||
    filePath.startsWith("mailto:") ||
    filePath.startsWith("tel:")
  );
};

const isLocalPath = (filePath: string): boolean => filePath.startsWith(".");

export const generateLinkTransformer = (
  linkPrefixForLocalPaths: string,
  allPaths: string[],
): UriTransformer => {
  const sep = path.sep;
  allPaths = allPaths.map((item) => path.join(sep, item)); // Already normalizes extra dots and slashes

  return (
    matchedUri: string,
    matchedContent: string,
    markdownFilePath: string,
  ) => {
    if (isWebPath(matchedUri))
      return {
        transformedUri: matchedUri,
        transformedContent: matchedContent,
      };
    if (!isLocalPath(matchedUri)) return null;

    // Ensures "/" is to start, normalizes by removing all "..", ".", and double slashes
    const normalizedPath = path.join(sep, markdownFilePath, matchedUri);

    // The markdown file must path to an existing file
    if (!allPaths.includes(normalizedPath)) return null;

    const fullPath = path
      .join(sep, linkPrefixForLocalPaths, normalizedPath)
      .replace(new RegExp(sep + "$"), ""); // Removes the trailing slash

    return {
      transformedUri: fullPath,
      transformedContent: matchedContent,
    };
  };
};
