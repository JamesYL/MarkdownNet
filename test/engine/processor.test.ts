import { MarkdownContentWithMetadata } from "@engine/ingestor";
import { processMarkdownContent } from "@engine/processor";
import { expect } from "chai";
import { JsonSchema, Settings } from "@home/index.d";
import { z } from "zod";
const content: MarkdownContentWithMetadata[] = [
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
const directoryStructure: JsonSchema = JSON.stringify({
  type: "object",
  properties: {
    "index.md": {
      type: "object",
    },
    "world.md": {
      type: "object",
    },
  },
  additionalProperties: false,
});
const settings: Settings = {
  entryFile: { name: "index.md", enforceDirectoryStructure: true },
  webPathPrefix: "prefix",
  directoryStructure,
  environmentVariables: {},
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
      schema,
      settings,
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
        schema,
        settings,
      ),
    ).to.throw();
  });
});
