import { getMarkdownContentWithMetadata } from "@engine/ingestor";
import { expect } from "chai";
import { mkdirSync, statSync, writeFileSync } from "fs";
import path from "path";
import { createTmpDirectoryAndTest } from "../helper";

describe("ingestor", () => {
  it("All fields are retrieved correctly", async () => {
    await createTmpDirectoryAndTest(async (tmpDir) => {
      const nestedDirPath = path.join(tmpDir, "nested");
      const nestedFilePath = path.join(nestedDirPath, "nested.md");
      const rootFilePath1 = path.join(tmpDir, "root1.md");
      const rootFilePath2 = path.join(tmpDir, "root2.md");
      mkdirSync(nestedDirPath);
      const fileData = [
        ["---", "title:thing1", "---", "\n    # thing   \n   \n"].join("\n"),
        ["---", "title:thing2", "---", "# thing"].join("\n"),
        ["---", "title:thing3\ndesc:desc1", "---", "# thing"].join("\n"),
      ];
      const filePaths = [nestedFilePath, rootFilePath1, rootFilePath2];
      filePaths.forEach((filePath, i) => {
        writeFileSync(filePath, fileData[i]);
      });

      const result = getMarkdownContentWithMetadata(tmpDir);
      expect(result).length(3);
      expect(result[0].frontMatter.title).to.equal("thing1");
      expect(result[0].frontMatter.desc).to.be.undefined;
      expect(result[1].frontMatter.title).to.equal("thing2");
      expect(result[1].frontMatter.desc).to.be.undefined;
      expect(result[2].frontMatter.title).to.equal("thing3");
      expect(result[2].frontMatter.desc).to.be.equal("desc1");

      result.forEach((content, i) => {
        const file = statSync(filePaths[i]);
        expect(content.relativeFilePath).to.equal(
          path.relative(tmpDir, filePaths[i]),
        );
        expect(content.fileLastModified.toString()).to.equal(
          file.mtime.toString(),
        );
        expect(content.markdownContent).to.equal("# thing");
      });
    });
  });
});
