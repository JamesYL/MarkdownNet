import { MarkdownContentWithMetadata } from "@engine/ingestor";
import {
  ValidateFlags,
  validateFilePaths,
  validateFrontMatter,
} from "./processor/validator";
import { ZodObject } from "zod";
import { FrontMatter } from "./ingestor/get_front_matter";

const defaultValidateFlags: ValidateFlags = {
  validateEntryFiles: { entryFileName: "index.md" },
};

export const processMarkdownContent = <
  MandatoryFrontMatter extends string,
  OptionalFrontMatter extends string,
>(
  content: MarkdownContentWithMetadata<
    MandatoryFrontMatter,
    OptionalFrontMatter
  >[],
  validateSettings: ValidateFlags = defaultValidateFlags,
  frontMatterSchema: ZodObject<
    FrontMatter<MandatoryFrontMatter, OptionalFrontMatter>
  >,
): any => {
  const filePaths = content.map((item) => item.relativeFilePath);
  validateFilePaths(filePaths, validateSettings);

  const parsedFrontMatter = content.map(({ frontMatter }) =>
    validateFrontMatter<MandatoryFrontMatter, OptionalFrontMatter>(
      frontMatter,
      frontMatterSchema,
    ),
  );
  return { parsedFrontMatter };
};
