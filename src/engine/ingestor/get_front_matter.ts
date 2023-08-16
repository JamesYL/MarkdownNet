const verifyFieldNameConvention = (field: string): void => {
  const fieldRegexString = "^[a-z_]+$";
  const fieldRegex = new RegExp(fieldRegexString);
  if (!fieldRegex.test(field))
    throw new Error(
      `Mandatory fields must follow this regex: /${fieldRegexString}/. ` +
        `The field that failed is this: >>>${field}<<<`,
    );
};
const verifyFieldValueConvention = (rawFieldValue: string): void => {
  const fieldValue = rawFieldValue.trimEnd();
  if (fieldValue !== rawFieldValue)
    throw new Error(
      "Field value must not have leading whitespace. " +
        `Field values: >>>${rawFieldValue}<<<`,
    );
  if (fieldValue === "") throw new Error("Field value must not be empty");
};

export type FrontMatter = Record<string, string>;

export const frontMatterRegex = /^[\s\n]*---\n([\s\S]+?)\n---\s*[\n|$]/;

/**
 * @param content Raw markdown content (including front matter)
 * @param mandatoryFields Fields that must be present in the front matter - throws exception if not present
 */
export const getFrontMatter = (rawContent: string): FrontMatter => {
  const match = rawContent.match(frontMatterRegex);
  if (match === null) return {} as FrontMatter;

  const frontMatterString = match[1];

  // Parse colon-separated fields
  const fields: Record<string, string> = {};
  frontMatterString.split("\n").map((line) => {
    const index = line.indexOf(":");
    if (index === -1)
      throw new Error(`Front matter line missing colon: >>>${line}<<<`);
    const fieldName = line.slice(0, index);
    const fieldValue = line.slice(index + 1).trimStart();

    verifyFieldNameConvention(fieldName);
    verifyFieldValueConvention(fieldValue);

    if (fieldName in fields) throw new Error("Duplicate field name");

    fields[fieldName] = fieldValue;
  });
  return fields;
};
