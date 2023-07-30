import { validateFilePaths } from "@engine/processor/validator";
import { expect } from "chai";

describe("processor - validator", () => {
  it("Duplicate file paths are not allowed", () => {
    expect(() =>
      validateFilePaths(["abc/test.md", "abc/test.md"], {}),
    ).to.throw();
    expect(() =>
      validateFilePaths(["abc/test.md", "abc/test1.md"], {}),
    ).to.not.throw();
    expect(() => validateFilePaths([], {})).to.not.throw();
  });

  it("Bad file path names are not allowed", () => {
    const badFilePaths = [
      ",",
      "",
      "abc-123",
      ".",
      "..",
      "/",
      "TEST.md",
      "test.MD",
      "path/to/test.MD",
      "path/to/ABC.md",
      "PATH/test.md",
      "path-a/to/test.md",
      "\\",
      "test.12",
      "test.12.md",
    ];
    badFilePaths.forEach((item) =>
      expect(() => validateFilePaths([item], {})).to.throw(),
    );
    const goodFilePaths = ["test.md", "path/to/test.md", "test.lasdjfalksdjf"];
    goodFilePaths.forEach((item) =>
      expect(() => validateFilePaths([item], {})).to.not.throw(),
    );
  });

  it("When validateEntryFiles is set, all directories must have valid entry files", () => {
    expect(() =>
      validateFilePaths(
        [],
        { entryFileName: "indexA.md" }, // Bad entry file name
      ),
    ).to.throw();

    const goodFilePaths = [
      "index.md",
      "nested/index.md",
      "another/index.md",
      "another/another/index.md",
      "nested/random.md",
      "another/another/random.md",
    ];
    expect(() =>
      validateFilePaths(goodFilePaths, { entryFileName: "index.md" }),
    ).to.not.throw();

    const badFilePaths = [
      ["nested/index.md"],
      ["index.md", "nested/random.md"],
      [""],
    ];

    badFilePaths.forEach((item) =>
      expect(() =>
        validateFilePaths(item, { entryFileName: "index.md" }),
      ).to.throw(),
    );
  });
});
