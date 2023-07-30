import { parseFrontMatter } from "./../../src/engine/processor/validator";
import { MarkdownContentWithMetadata } from "@engine/ingestor";
import { processMarkdownContent } from "@engine/processor";
import { DirectoryStructure } from "@engine/processor/validators/validate_directory_structure";
import { expect } from "chai";
import { z } from "zod";
type MandatoryFrontMatter = "title" | "desc";
type OptionalFrontMatter = "random";
const content: MarkdownContentWithMetadata<
  MandatoryFrontMatter,
  OptionalFrontMatter
>[] = [
  {
    markdownContent: "# Hello [test](../world.md)",
    frontMatter: { title: "Hello", desc: "World", random: "abcde" },
    fileLastModified: new Date(),
    relativeFilePath: "index.md",
  },
  {
    markdownContent: "# Hello [test](../index.md)",
    frontMatter: { title: "Hello", desc: "index" },
    fileLastModified: new Date(),
    relativeFilePath: "world.md",
  },
];
const settings = {
  entryFileName: "index.md",
  webPathPrefix: "prefix",
};
const directorySchema: DirectoryStructure = {
  "index.md": {},
  "world.md": {},
};
type FrontMatterSchema = {
  title: string;
  desc: string;
};
const schema = z.object({
  title: z.string(),
  desc: z.string(),
  random: z.string().length(5).optional(),
});
describe("processor", () => {
  it("processMarkdownContent", () => {
    const res = processMarkdownContent<FrontMatterSchema>(
      content,
      settings,
      schema,
      directorySchema,
    );
    expect(res[0].markdownWithWebPaths).to.be.equal(
      "# Hello [test](/prefix/world.md)",
    );
    expect(res[0].relativeFilePath).to.be.equal("index.md");
    expect(res[0].fileLastModified).to.be.equal(content[0].fileLastModified);
    expect(res[0].parsedFrontMatter.desc).to.be.equal(
      content[0].frontMatter.desc,
    );

    expect(res[1].relativeFilePath).to.be.equal("world.md");
  });

  it("processMarkdownContent fails when frontmatter doesn't pass schema", () => {
    expect(() =>
      processMarkdownContent<FrontMatterSchema>(
        [
          {
            markdownContent: "# Hello [test](../world.md)",
            frontMatter: { title: "Hello", desc: "World", random: "random" }, // Random too long
            fileLastModified: new Date(),
            relativeFilePath: "index.md",
          },
        ],
        settings,
        schema,
        directorySchema,
      ),
    ).to.throw();
  });
});