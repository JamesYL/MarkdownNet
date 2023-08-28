import { expect } from "chai";
import { extractFrontMatterAndContent } from "@parser/extract_front_matter_and_content";
import { z } from "zod";

const simpleSchema = z.object({
  title: z.string().length(5),
  desc: z.string(),
});

describe("extract_front_matter_and_content", () => {
  it("Standard content is extracted correctly", () => {
    const { frontMatter, markdownContent } = extractFrontMatterAndContent(
      `---
      title: thing
      desc: something here
      ---
      
      
      # Title

      lol

      
      `,
      simpleSchema,
    );
    expect(frontMatter.title).equal("thing");
    expect(frontMatter.desc).equal("something here");
    expect(markdownContent).equal(`# Title\n\nlol`);
  });

  it("Duplicate frontmatter throws", () => {
    expect(() =>
      extractFrontMatterAndContent(
        `---
      title: thing
      desc: something here
      desc: something here
      ---`,
        simpleSchema,
      ),
    ).to.throw();
  });

  it("Throws when doesn't follow schema", () => {
    expect(() =>
      extractFrontMatterAndContent(
        `---
      title: thing1
      desc: something here
      ---`,
        simpleSchema,
      ),
    ).to.throw();
    expect(() =>
      extractFrontMatterAndContent(
        `---
      title: thing
      desc: something here
      another: something here
      ---`,
        simpleSchema,
      ),
    ).to.throw();
    expect(() =>
      extractFrontMatterAndContent(
        `---
      title: thing
      ---`,
        simpleSchema,
      ),
    ).to.throw();
  });

  it("Frontmatter keys and values are trimmed", () => {
    it("Standard front matter is extracted correctly", () => {
      const { frontMatter } = extractFrontMatterAndContent(
        `---
         title    :    thing   
         desc   :     something    here    
      ---`,
        simpleSchema,
      );
      expect(frontMatter.title).equal("thing");
      expect(frontMatter.desc).equal("something    here");
    });
  });
});
