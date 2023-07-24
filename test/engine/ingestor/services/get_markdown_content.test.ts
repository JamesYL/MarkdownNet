import { expect } from "chai";
import { extractMarkdownContent } from "@engine/ingestor/get_markdown_content";

describe("ingestor - get_markdown_content", () => {
  it("Markdown content with front matter removes front matter", () => {
    const markdown = extractMarkdownContent(
      `
---
title:thing1
---

    # Thing


    `,
    );
    expect(markdown).to.be.equal("# Thing");
  });
  it("Markdown content without front matter is extracted", () => {
    const markdown = extractMarkdownContent(
      `

    # Thing


    `,
    );
    expect(markdown).to.be.equal("# Thing");
  });
});
