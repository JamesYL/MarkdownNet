import { validateFilePaths } from "@engine/processor/services/validator";
import { expect } from "chai";
describe("processor - validator", () => {
  it("Duplicate file paths are not allowed", () => {
    expect(() => validateFilePaths(["abc/test.md", "abc/test.md"])).to.throw();
    expect(() =>
      validateFilePaths(["abc/test.md", "abc/test1.md"]),
    ).to.not.throw();
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
      "\\",
      "test.12",
      "test.12.md",
    ];
    badFilePaths.forEach(
      (item) => expect(() => validateFilePaths([item])).to.throw,
    );
    const goodFilePaths = ["test.md", "path/to/test.md", "test.lasdjfalksdjf"];
    goodFilePaths.forEach((item) =>
      expect(() => validateFilePaths([item])).to.not.throw(),
    );
  });
});
