import { validateDirectoryStructure } from "@engine/processor/validators/validate_directory_structure";
import { expect } from "chai";

describe("processor - validate directory structure", () => {
  it("validateDirectoryStructure should not throw on match", () => {
    expect(() => {
      validateDirectoryStructure(["test.md", "inner.md", "path/to/index.md"], {
        "test.md": {},
        "inner.md": {},
        path: {
          to: {
            "index.md": {},
          },
        },
      });
    }).to.not.throw();
  });
  it("validateDirectoryStructure should throw on mismatch", () => {
    expect(() => {
      validateDirectoryStructure(["test.md", "inner.md", "path/to/index.md"], {
        "test.md": {},
        "inner.md": {},
        path: {
          to: {},
        },
      });
    }).to.throw();
  });
});
