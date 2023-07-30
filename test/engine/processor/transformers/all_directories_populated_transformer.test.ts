import { Transformer } from "@engine/processor/transform_markdown_path";
import genTransformer from "@engine/processor/transformers/all_directories_populated_transformer";
import { expect } from "chai";

const allFilePaths = new Set([
  "path/to/file.md",
  "path/file.md",
  "path/to/file2.md",
  "path/to/file3.md",
  "path/to/index.md",
  "file.md",
  "/",
]);
const entryFile = "index.md";
const defaultTransformer = genTransformer(entryFile);
describe("processor - all_directories_populated_transformer", () => {
  const testSlashPermutations = (
    localMatchedPath: string,
    relativeMarkdownFilePath: string,
    expected: string,
    transformer: Transformer = defaultTransformer,
  ) => {
    relativeMarkdownFilePath = relativeMarkdownFilePath.replace(/^\//, "");
    [relativeMarkdownFilePath, `/${relativeMarkdownFilePath}`].forEach(
      (relativeMarkdownFilePath) => {
        const result = transformer(
          localMatchedPath,
          relativeMarkdownFilePath,
          allFilePaths,
        );
        expect(result).to.equal(expected);
      },
    );
  };
  it("When the path goes to an entry file, parent directory gets returned instead", () => {
    const localMatchedPath = "../index.md";
    const relativeMarkdownFilePath = "path/to/test.md";
    const expected = "path/to";
    testSlashPermutations(localMatchedPath, relativeMarkdownFilePath, expected);
  });

  it("When the path is missing, it throws", () => {
    const localMatchedPath = "../asldfkjasdlfkj.md";
    const relativeMarkdownFilePath = "path/to/test.md";
    const expected = "doesnt matter what this is";
    expect(() =>
      testSlashPermutations(
        localMatchedPath,
        relativeMarkdownFilePath,
        expected,
      ),
    ).to.throw();
  });

  it("When the path is not entry and exists, it works as expected", () => {
    const localMatchedPath = "../file.md";
    const relativeMarkdownFilePath = "path/to/test.md";
    const expected = "path/to/file.md";
    testSlashPermutations(localMatchedPath, relativeMarkdownFilePath, expected);
  });

  it("When the entry name is missing, it works as expected", () => {
    const localMatchedPath = "../index.md";
    const relativeMarkdownFilePath = "path/to/test.md";
    const expected = "path/to/index.md";
    testSlashPermutations(
      localMatchedPath,
      relativeMarkdownFilePath,
      expected,
      genTransformer(""),
    );
  });

  it("When the path is empty, it should be just be a slash", () => {
    const localMatchedPath = "..";
    const relativeMarkdownFilePath = "test.md";
    const expected = "/";
    testSlashPermutations(localMatchedPath, relativeMarkdownFilePath, expected);
  });
});
