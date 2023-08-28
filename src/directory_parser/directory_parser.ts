import type { FrontMatter, Settings } from "@home/index.d";
import { getFileContentInDirectory } from "./get_file_content";
import path from "path";
import { validateFilePaths } from "./validator";
import type { RawFileInfo } from "@home/index.d";

export class DirectoryParser<T = FrontMatter> {
  private entryDirectory: string;
  private settings: Settings<T>;

  constructor(settings: Settings<T>) {
    this.settings = settings;
    this.entryDirectory = path.resolve(__dirname, settings.entryDirectory);
  }

  public parseAndValidate(): RawFileInfo[] {
    const fileContent = getFileContentInDirectory(this.entryDirectory);
    const results = fileContent.map((content) => {
      const relativeFilePath = path.relative(
        this.entryDirectory,
        content.fileContent,
      );
      return { ...content, filePath: relativeFilePath };
    });

    validateFilePaths(
      results.map((result) => result.filePath),
      this.settings,
    );

    return results;
  }
}
