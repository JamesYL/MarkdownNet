import { validateDirectoryStructure } from "@engine/processor/validators/validate_directory_structure";
import { expect } from "chai";

describe("processor - validate directory structure", () => {
  it("validateDirectoryStructure should not throw on match", () => {
    expect(() => {
      validateDirectoryStructure(
        ["test.md", "inner.md", "path/to/index.md"],
        JSON.stringify({
          type: "object",
          properties: {
            "test.md": { type: "object" },
            "inner.md": { type: "object" },
            path: {
              type: "object",
              properties: {
                to: {
                  type: "object",
                  properties: {
                    "index.md": { type: "object" },
                  },
                },
              },
            },
          },
        }),
      );
    }).to.not.throw();
  });
  it("validateDirectoryStructure should throw on mismatch", () => {
    expect(() => {
      validateDirectoryStructure(
        ["test.md", "inner.md", "path/to/index.md"],
        JSON.stringify({
          type: "object",
          properties: {
            "test.md": { type: "object" },
            "inner.md": { type: "object" },
            path: {
              type: "object",
              properties: {
                to: {
                  type: "object",
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        }),
      );
    }).to.throw();
  });
});
