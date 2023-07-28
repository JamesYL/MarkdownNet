import { convertMarkdownPathsIntoWebPaths } from "@engine/processor/transform_markdown_path";
import { expect } from "chai";

describe("processor - transform_markdown_paths", () => {
  const testSlashPermutations = (
    content: string,
    relativeMarkdownFilePath: string,
    webPathPrefix: string,
    expected: string,
  ) => {
    relativeMarkdownFilePath = relativeMarkdownFilePath.replace(/^\//, "");
    webPathPrefix = webPathPrefix.replace(/^\//, "");
    [relativeMarkdownFilePath, `/${relativeMarkdownFilePath}`].forEach(
      (relativeMarkdownFilePath) => {
        [webPathPrefix, `/${webPathPrefix}`].forEach((newWebPathPrefix) => {
          const result = convertMarkdownPathsIntoWebPaths(
            content,
            relativeMarkdownFilePath,
            newWebPathPrefix,
          );
          expect(result).to.equal(expected);
        });
      },
    );
  };

  it("Multiple simple paths", () => {
    const content = "This is a [test](../file.md), [test2](../../file.md)";
    const relativeMarkdownFilePath = "path/to/file.md";
    const webPathPrefix = "user/blogs/1";
    const expected =
      "This is a [test](/user/blogs/1/path/to/file.md), [test2](/user/blogs/1/path/file.md)";
    testSlashPermutations(
      content,
      relativeMarkdownFilePath,
      webPathPrefix,
      expected,
    );
  });

  it("Path that goes beyond root", () => {
    const content = "This is a [test](../../../../path/file.md)";
    const relativeMarkdownFilePath = "path/to/file.md";
    const webPathPrefix = "user/blogs/1";
    const expected = "This is a [test](/user/blogs/1/path/file.md)";
    testSlashPermutations(
      content,
      relativeMarkdownFilePath,
      webPathPrefix,
      expected,
    );
  });

  it("Absolute paths are not allowed", () => {
    const content = "This is a [test](/test/file.md)";
    const relativeMarkdownFilePath = "path/to/file.md";
    const webPathPrefix = "user/blogs/1";
    expect(() =>
      convertMarkdownPathsIntoWebPaths(
        content,
        relativeMarkdownFilePath,
        webPathPrefix,
      ),
    ).to.throw();
  });

  it("Non local file paths are allowed", () => {
    const relativeMarkdownFilePath = "path/to/file.md";
    const webPathPrefix = "user/blogs/1";
    [
      "This is a [test](www.google.com)",
      "This is a [test](http://www.google.com)",
      "This is a [test](https://www.google.com)",
      "This is a [test](mailto:someone@google.com)",
    ].forEach((content) => {
      testSlashPermutations(
        content,
        relativeMarkdownFilePath,
        webPathPrefix,
        content,
      );
    });
  });
});