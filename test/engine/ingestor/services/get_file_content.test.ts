import { expect } from "chai";
import { getFileContentInDirectory } from "@engine/ingestor/services/get_file_content";
import { writeFileSync, mkdirSync, statSync } from "fs";
import path from "path";
import { createTmpDirectoryAndTest } from "../../../helper";

describe("get_file_content", () => {
  it("Valid markdown files in nested directories are detected", async () => {
    await createTmpDirectoryAndTest(async (tmpDir) => {
      const nestedDirPath = path.join(tmpDir, "nested");
      const nestedFilePath = path.join(nestedDirPath, "nested.md");
      const rootFilePath1 = path.join(tmpDir, "root1.md");
      const rootFilePath2 = path.join(tmpDir, "root2.md");
      mkdirSync(nestedDirPath);
      const fileData = "# thing";
      const filePaths = [nestedFilePath, rootFilePath1, rootFilePath2];
      filePaths.forEach((filePath, i) => {
        writeFileSync(filePath, fileData + i);
      });
      const result = getFileContentInDirectory(tmpDir);
      expect(result).length(3);

      result.forEach((content, i) => {
        const file = statSync(filePaths[i]);
        expect(filePaths[i]).to.equal(content.absoluteFilePath);
        expect(content.fileContent).to.equal(fileData + i);
        expect(file.birthtime.toString()).to.equal(
          content.createdDate.toString(),
        );
        expect(file.mtime.toString()).to.equal(content.updatedDate.toString());
      });
    });
  });

  it("Non-markdown files are ignored", async () => {
    await createTmpDirectoryAndTest(async (tmpDir) => {
      writeFileSync(path.join(tmpDir, "root1.MD"), "# thing");
      expect(getFileContentInDirectory(tmpDir)).length(1);
      writeFileSync(path.join(tmpDir, "root1.pdf"), "# thing");
      writeFileSync(path.join(tmpDir, "root1.tex"), "# thing");
      expect(getFileContentInDirectory(tmpDir)).length(1);
    });
  });
});
