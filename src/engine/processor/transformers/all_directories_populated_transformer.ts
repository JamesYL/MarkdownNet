import path from "path";
import { Transformer } from "../transform_markdown_path";

/**
 * This transformer will combine the entry path to the matched path.
 * If this new path doesn't exist in all file paths, an error will be thrown.
 * If there is an index file, the parent directory will be used.
 */
const transformer: (entryFile: string) => Transformer =
  (entryFile: string) =>
  (
    localMatchedPath: string,
    markdownFileEntryPath: string,
    allFilePaths: Set<string>,
  ) => {
    if (markdownFileEntryPath.startsWith("/"))
      markdownFileEntryPath = markdownFileEntryPath.slice(1);

    // Added "/" and removing it handles the case if the path starts with ".."
    let newPath = path.join("/", markdownFileEntryPath, localMatchedPath);
    if (newPath.startsWith("/")) newPath = newPath.slice(1);

    if (!allFilePaths.has(newPath))
      throw new Error(`Path not found: >>>${newPath}<<<`);
    if (path.basename(newPath) === entryFile) return path.dirname(newPath);
    return newPath;
  };

export default transformer;
