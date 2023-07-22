import { expect } from "chai";
import path from "path";
import os from "os";
import { parseContent, parseMarkdown } from "./content_parser";

const entryDirectory = path.join(
  os.homedir(),
  "cshelp",
  "transformer",
  "webapp-docs",
  "data",
);
describe("Content Parser", () => {
  describe("parseContent", () => {
    it("should return the input string for non-markdown files", () => {
      const content = "This is a [test](./file.md)";
      const extensions = [".txt", ".tex", ".ts", "pdf"];
      extensions.forEach((extension) => {
        const result = parseContent(
          content,
          extension,
          entryDirectory,
          path.join(entryDirectory, "file.txt"),
        );
        expect(result).to.equal(content);
      });
    });

    it("should trim start", () => {
      const content = "This is a [test](./file.md)";
      const result = parseContent(
        "\n\n  " + content,
        ".anythinghere",
        entryDirectory,
        path.join(entryDirectory, "file.txt"),
      );
      expect(result).to.equal(content);
    });

    it("should not return the same input string for markdown files", () => {
      const content = "This is a [test](./file.md)";
      const result = parseContent(
        content,
        ".md",
        entryDirectory,
        path.join(entryDirectory, "folder", "file.md"),
      );
      expect(result).to.not.equal(content);
    });
  });

  describe("parseMarkdown", () => {
    const parseMarkdownLinkHelper = (oldPath: string, newPath: string) => {
      const content = `This is a [test](${oldPath})`;
      const expected = `This is a [test](${newPath})`;
      const result = parseMarkdown(
        content,
        entryDirectory,
        path.join(entryDirectory, "folder", "file.md"),
      );
      expect(result).to.equal(expected);
    };

    it("should replace relative links with web links", () => {
      parseMarkdownLinkHelper("./test.md", "/folder/test");
      parseMarkdownLinkHelper("../file.md", "/file");
      parseMarkdownLinkHelper(".", "/folder/file");
      parseMarkdownLinkHelper("../folder/../test", "/test");
    });

    it("should not replace absolute links", () => {
      parseMarkdownLinkHelper("https://example.com", "https://example.com");
      parseMarkdownLinkHelper("/test/123", "/test/123");
    });

    it("should get rid of index.md in the path", () => {
      parseMarkdownLinkHelper("./index.md", "/folder");
    });
  });
});
