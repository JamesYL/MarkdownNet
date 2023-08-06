import { getDefaultSettings } from "./../src/index";
import fs from "fs";
import { Settings, getMarkdownNet } from "@home";
import { createTmpDirectoryAndTest } from "./helper";
import path from "path";
import { z } from "zod";
import { expect } from "chai";
describe("Main entry point", () => {
  it("getMarkdownNet", () => {
    const settings: Settings = {
      ...getDefaultSettings(),
      directoryStructure: JSON.stringify({
        type: "object",
        properties: {
          "test.md": {
            type: "object",
          },
          "test2.md": {
            type: "object",
          },
        },
        additionalProperties: false,
      }),
    };
    createTmpDirectoryAndTest(async (tmpDir) => {
      fs.writeFileSync(
        path.join(tmpDir, "test.md"),
        "---\ntest:1\n---\n# test",
      );
      fs.writeFileSync(
        path.join(tmpDir, "test2.md"),
        "---\ntest:2\n---\n# test123",
      );
      const results = getMarkdownNet(
        tmpDir,
        z.object({ test: z.string().length(1) }),
        settings,
      );
      expect(results).to.be.length(2);
      expect(results[0].parsedFrontMatter.test).to.be.equal("1");
      expect(results[1].parsedFrontMatter.test).to.be.equal("2");
      expect(results[0].relativeFilePath).to.be.equal("test.md");
      expect(results[1].relativeFilePath).to.be.equal("test2.md");
      expect(results[0].markdownWithWebPaths).to.be.equal("# test");
      expect(results[1].markdownWithWebPaths).to.be.equal("# test123");
    });
  });
});
