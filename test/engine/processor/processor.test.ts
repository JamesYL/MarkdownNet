import { MarkdownContentWithMetadata } from "@engine/ingestor";
import { processMarkdownContent } from "@engine/processor";
import { expect } from "chai";
import { ZodSchema, z } from "zod";
type MandatoryFrontMatter = "title" | "desc";
type OptionalFrontMatter = "random";
const content: MarkdownContentWithMetadata<
  MandatoryFrontMatter,
  OptionalFrontMatter
>[] = [
  {
    markdownContent: "# Hello [test](../world.md)",
    frontMatter: { title: "Hello", desc: "World", random: 1 },
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
type SchemaType = { title: string; desc: string; random?: number };
const schema: ZodSchema<SchemaType> = z.object({
  title: z.string(),
  desc: z.string(),
  random: z.number().optional(),
});
describe("processor", () => {
  it("processMarkdownContent", () => {
    const res = processMarkdownContent<SchemaType>(content, settings, schema);
    expect(res[0].markdownWithWebPaths).to.be.equal(
      "# Hello [test](/prefix/world.md)",
    );
    expect(res[1].markdownWithWebPaths).to.be.equal("# Hello [test](/prefix)");
  });

  it("processMarkdownContent fails when frontmatter doesn't pass schema", () => {
    const runner = () =>
      processMarkdownContent<SchemaType>(
        [
          {
            markdownContent: "# Hello [test](../world.md)",
            frontMatter: { title: "Hello", desc: "World", random: "random" }, // Random should be number
            fileLastModified: new Date(),
            relativeFilePath: "index.md",
          },
        ],
        settings,
        schema,
      );
    expect(runner).to.throw();
  });
});
