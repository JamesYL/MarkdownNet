import { validateFilePaths } from "@parser/validate_file_paths";
import { getSettings } from "../helper";
import { expect } from "chai";
const settings = getSettings();
settings.directoryStructure = JSON.stringify({
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  patternProperties: {
    "^module\\d+$": {
      type: "object",
      patternProperties: {
        "^item\\d+$": {
          type: "object",
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
});

describe("validate_file_paths", () => {
  it("Valid file paths won't throw", async () => {
    const validPaths = [
      ["./module1/item1"],
      ["./module1/item1", "./module1/item2"],
    ];
    validPaths.forEach((item) => validateFilePaths(item, settings));
  });
  it("Invalid file paths throw", async () => {
    const invalidPaths = [
      ["./module/item1"],
      ["./module1/item"],
      ["./module1/item1/item1"],
    ];
    invalidPaths.forEach((item) => {
      expect(() => validateFilePaths(item, settings)).to.throw();
    });
  });
  it("Duplicate file path", async () => {
    expect(() =>
      validateFilePaths(["./module1/item1", "./module1/item1"], settings),
    ).to.throw();
  });
});
