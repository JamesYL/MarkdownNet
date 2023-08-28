import { createTmpDirectoryAndTest } from "./helper";
import { MarkdownNet } from "index";
import { getSettings } from "./helper";
import path from "path";
import { mkdirSync, writeFileSync } from "fs";
import { z } from "zod";
import { expect } from "chai";
import { MarkdownNetItem, NestedMarkdownNet } from "@home/*";

const simpleSchema = z.object({
  title: z.string().length(5),
  desc: z.string(),
});

const createFiles = (tmpDir: string): MarkdownNet => {
  const settings = getSettings();
  const markdownNet = new MarkdownNet({
    ...settings,
    entryDirectory: tmpDir,
    directoryStructure: JSON.stringify({
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
    }),
    frontMatterSchema: simpleSchema,
  });
  const nestedDirPath = path.join(tmpDir, "nested");
  const nestedFilePath = path.join(nestedDirPath, "nested.md");
  const rootFilePath1 = path.join(tmpDir, "root1.md");
  const rootFilePath2 = path.join(tmpDir, "root2.md");
  mkdirSync(nestedDirPath);
  const fileData = `---
      title: thing
      desc: something here
      ---
      # Title
      `;
  const filePaths = [nestedFilePath, rootFilePath1, rootFilePath2];
  filePaths.forEach((filePath) => {
    writeFileSync(filePath, fileData);
  });
  return markdownNet;
};

describe("index", () => {
  it("getFlatten", async () => {
    await createTmpDirectoryAndTest(async (tmpDir) => {
      const res = createFiles(tmpDir).getFlatten();
      expect(res).to.have.lengthOf(3);
      expect(res[0].frontMatter.title).equal("thing");
      expect(res[0].frontMatter.desc).equal("something here");
      expect(res[0].markdownContent).equal(`# Title`);
      expect(res[0].filePath).equal(`nested/nested.md`);
      expect(res[0].updatedDate).greaterThan(new Date(Date.now() - 5000));
    });
  });

  it("getNested", async () => {
    await createTmpDirectoryAndTest(async (tmpDir) => {
      const res = createFiles(tmpDir).getNested();
      const checkAndRemoveDates = (
        actual: NestedMarkdownNet | MarkdownNetItem,
        expected: NestedMarkdownNet | MarkdownNetItem,
      ) => {
        if (typeof actual === "object" && actual.updatedDate) {
          expect(actual.updatedDate).greaterThan(new Date(Date.now() - 5000));
          expected.updatedDate = actual.updatedDate;
          expect(actual).to.be.deep.equal(expected);
          return;
        }
        expect(Object.keys(actual)).to.have.length(
          Object.keys(expected).length,
        );
        Object.keys(actual).forEach((key) => {
          expect(key in expected).to.be.true;

          checkAndRemoveDates(
            (actual as NestedMarkdownNet)[key],
            (expected as NestedMarkdownNet)[key],
          );
        });
      };
      const expected = {
        nested: {
          "nested.md": {
            frontMatter: { title: "thing", desc: "something here" },
            markdownContent: "# Title",
            filePath: "nested/nested.md",
            updatedDate: new Date(),
          },
        },
        "root1.md": {
          frontMatter: { title: "thing", desc: "something here" },
          markdownContent: "# Title",
          filePath: "root1.md",
          updatedDate: new Date(),
        },
        "root2.md": {
          frontMatter: { title: "thing", desc: "something here" },
          markdownContent: "# Title",
          filePath: "root2.md",
          updatedDate: new Date(),
        },
      };
      checkAndRemoveDates(res, expected);
      expect(res).to.be.deep.equal(expected);
    });
  });
});
