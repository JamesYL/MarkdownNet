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
  const fieldValue = rawFieldValue.trim();
  if (fieldValue !== rawFieldValue)
    throw new Error(
      "Field value must not have leading or trailing whitespace. " +
        `Field values: >>>${rawFieldValue}<<<`,
    );
};

type RequiredFrontMatter<MandatoryFields extends string> = {
  [K in MandatoryFields]: string;
};
type OptionalFrontMatter<OptionalFields extends string> = Partial<
  RequiredFrontMatter<OptionalFields>
>;
export type FrontMatter<
  MandatoryFields extends string,
  OptionalFields extends string,
> = RequiredFrontMatter<MandatoryFields> & OptionalFrontMatter<OptionalFields>;

export const frontMatterRegex = /^[\s\n]*---\n([\s\S]+?)\n---\s*[\n|$]/;

/**
 * @param content Raw markdown content (including front matter)
 * @param mandatoryFields Fields that must be present in the front matter - throws exception if not present
 */
export const getFrontMatter = <
  MandatoryFields extends string,
  OptionalFields extends string,
>(
  rawContent: string,
  mandatoryFields: Set<MandatoryFields>,
): FrontMatter<MandatoryFields, OptionalFields> => {
  for (const mandatoryField of mandatoryFields)
    verifyFieldNameConvention(mandatoryField as string);

  const match = rawContent.match(frontMatterRegex);
  if (match === null) {
    if (mandatoryFields.size === 0)
      return {} as FrontMatter<MandatoryFields, OptionalFields>;
    throw new Error("Could not find front matter in content.");
  }

  const frontMatterString = match[1];

  // Parse colon-separated fields
  const fields: Record<string, string> = {};
  frontMatterString.split("\n").map((line) => {
    const index = line.indexOf(":");
    if (index === -1)
      throw new Error(`Front matter line missing colon: >>>${line}<<<`);
    const fieldName = line.slice(0, index);
    const fieldValue = line.slice(index + 1);

    verifyFieldNameConvention(fieldName);
    verifyFieldValueConvention(fieldValue);

    mandatoryFields.delete(fieldName as MandatoryFields);

    if (fieldName in fields) throw new Error("Duplicate field name");

    fields[fieldName] = fieldValue;
  });

  if (mandatoryFields.size === 0)
    return fields as FrontMatter<MandatoryFields, OptionalFields>;

  throw new Error(
    `Missing mandatory fields in front matter: >>>${[...mandatoryFields].join(
      "<<<, >>>",
    )}<<<`,
  );
};
