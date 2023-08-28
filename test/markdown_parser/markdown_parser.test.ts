import { expect } from "chai";
import { MarkdownParser } from "@parser/markdown_parser";
import { z } from "zod";
import { getSettings } from "../helper";

const simpleSchema = z.object({
  title: z.string().length(5),
  desc: z.string(),
});
const markdownParser = new MarkdownParser(getSettings(), [
  "./root.md",
  "./click.md", // Assuming this file exists
  "./nested/another.md",
]);

describe("markdown_parser", () => {
  it("Standard content is not transformed", async () => {
    const markdownParser = new MarkdownParser(getSettings(), ["./root.md"]);
    const result = markdownParser.parse("# Hello", "./root.md");
    expect(result.markdownContent).equal("# Hello");
  });

  it("Content and front matter are extracted correctly", async () => {
    const markdownContent = `---
      title: thing
      desc: something here
      ---
      # Test
      `;
    const settings = getSettings();
    settings.frontMatterSchema = simpleSchema;
    const markdownParser = new MarkdownParser(settings, ["./root.md"]);
    const result = markdownParser.parse(markdownContent, "./root.md");

    expect(result.frontMatter.title).equal("thing");
    expect(result.frontMatter.desc).equal("something here");
    expect(result.markdownContent).equal("# Test");
  });

  it("Web link is transformed correctly", async () => {
    const markdownContent = `Visit [OpenAI](https://www.openai.com/) for AI goodness.`;
    const result = markdownParser.parse(markdownContent, "./root.md");
    expect(result.markdownContent).equal(markdownContent);
  });

  it("Local link is transformed correctly", async () => {
    const markdownContent = `[Click me](../click.md) for local content and [me](../nested/another.md)`;
    const result = markdownParser.parse(markdownContent, "./root.md");
    expect(result.markdownContent).equal(
      "[Click me](/courses/click.md) for local content and [me](/courses/nested/another.md)",
    );
  });

  it("Variables are transformed", async () => {
    const markdownContent = `[Click me]($discord)`;
    const settings = getSettings();
    settings.environmentVariables.discord = "www.discord.com";
    const markdownParser = new MarkdownParser(settings, ["./root.md"]);
    const result = markdownParser.parse(markdownContent, "./root.md");
    expect(result.markdownContent).equal("[Click me](www.discord.com)");
  });

  it("Throws when links cannot be transformed", async () => {
    const invalidReferenceLink = `[Click me](./click.md) for local content.`; // "./click.md doesn't exist, only ../click.md"
    const badSyntaxLink = `[Click me](alsmkfdlkdasdf) for local content.`; // "./click.md doesn't exist, only ../click.md"
    const badEnvVar = `[Click me]($a) for local content.`; // "./click.md doesn't exist, only ../click.md"
    const items = [invalidReferenceLink, badSyntaxLink, badEnvVar];
    items.forEach((item) => {
      expect(() => markdownParser.parse(item, "./root.md")).to.throw();
    });
  });
});
