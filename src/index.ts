import { DirectoryParser } from "./directory_parser/directory_parser";
import type {
  FrontMatter,
  MarkdownNetItem,
  NestedMarkdownNet,
  Settings,
} from "@home/index.d";

import { MarkdownParser } from "./markdown_parser/markdown_parser";

export class MarkdownNet<T = FrontMatter> {
  private settings: Settings<T>;

  constructor(settings: Settings<T>) {
    this.settings = settings;
  }

  public getFlatten(): MarkdownNetItem<T>[] {
    const directoryPaser = new DirectoryParser(this.settings);
    const content = directoryPaser.parseAndValidate();

    const markdownParser = new MarkdownParser<T>(
      this.settings,
      content.map((item) => item.filePath),
    );

    const combinedData = content.map((item) => {
      const parsedMarkdown = markdownParser.parse(
        item.fileContent,
        item.filePath,
      );
      return {
        frontMatter: parsedMarkdown.frontMatter,
        markdownContent: parsedMarkdown.markdownContent,
        filePath: item.filePath,
        updatedData: item.updatedDate,
      };
    });
    return combinedData;
  }

  public getNested = (): NestedMarkdownNet<T> => {
    const data = this.getFlatten();
    const nestedDirectory: NestedMarkdownNet<T> = {};
    data.forEach((item) => {
      let currDirectory = nestedDirectory;
      const split = item.filePath.split("/");
      split.forEach((directory, i) => {
        if (i === split.length - 1) {
          currDirectory[directory] = item;
        } else {
          if (!(directory in currDirectory)) {
            currDirectory[directory] = {};
          }
          currDirectory = currDirectory[directory] as NestedMarkdownNet<T>;
        }
      });
    });
    return nestedDirectory;
  };
}
