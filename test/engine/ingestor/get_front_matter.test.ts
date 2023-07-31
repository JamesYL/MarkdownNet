import { expect } from "chai";
import { getFrontMatter } from "@engine/ingestor/get_front_matter";

describe("ingestor - get_front_matter", () => {
  it("Standard front matter is extracted correctly", () => {
    const validValue =
      "abcdefghljklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_+-=[]{}|;':\",./<>?~`\\/---";
    const frontMatter = getFrontMatter(
      `
---
title:thing1
desc_example:${validValue}
---
# Thing
    `,
    );
    expect(frontMatter.title).equal("thing1");
    expect(frontMatter["desc_example"]).equal(validValue);
  });

  it("Malformed front matter throws error", () => {
    const badFrontMatter = [
      "space : thing",
      "space:thing ",
      " space:thing",
      "space space:thing",
      ":space",
      " :space",
      "space: ",
      ":",
      "number1:thing",
      "capsA:thing",
      "dash-:thing",
      "missingcolon",
      "duplicate:duplicate\nduplicate:duplicate",
      "emptyline:emptyline\n\nthing:emptyline",
      "emptyline:emptyline\n \nthing:emptyline",
    ];
    badFrontMatter.forEach((matter) => {
      expect(() =>
        getFrontMatter(`---\n${matter}\n---\n # something`),
      ).to.throw();
    });
  });

  it("Empty front matter is parsed correctly", () => {
    expect(getFrontMatter("# Title")).to.be.empty;
  });
});
