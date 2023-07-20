import path from "path";

export const parseMarkdown = (
  content: string,
  entryDirectory: string,
  fullFilePath: string,
): string => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return content.replace(
    linkRegex,
    (match: string, title: string, relativePath: string) => {
      if (!relativePath.startsWith(".")) return match;
      const splitFullFile = fullFilePath.split("/");
      splitFullFile.pop(); // This gets the directory path
      const filePath =
        relativePath === "."
          ? fullFilePath
          : path.join(splitFullFile.join("/"), relativePath);
      return `[${title}](${getWebPath(entryDirectory, filePath)})`;
    },
  );
};

export const parseContent = (
  content: string,
  fileExtension: string,
  entryDirectory: string,
  fullPath: string,
): string => {
  content = content.trimStart();
  if (fileExtension === ".md")
    return parseMarkdown(content, entryDirectory, fullPath);
  return content;
};

/**
 * /root/start/intern/index.md --> /start/intern
 * /root/start/intern/test.md --> /start/intern/test.md
 */
export const getWebPath = (
  entryDirectory: string,
  filePath: string,
): string => {
  const relativePath = filePath.replace(entryDirectory, "");
  if (relativePath === "" || relativePath === "/") return "/";
  const parts = relativePath.split("/");

  if (parts[0] === "") parts.shift(); // remove first empty string if present

  if (parts[parts.length - 1] === "index.md") {
    parts.pop();
  }
  return "/" + parts.join("/");
};
