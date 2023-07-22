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
  if (fieldValue === "") throw new Error("Field value cannot be empty.");
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

export const frontMatterRegex = /^[\s\n]*---\n([\s\S]+?)\n---\n/;

/**
 * @param content Raw markdown content (including front matter)
 * @param mandatoryFields Fields that must be present in the front matter - throws exception if not present
 */
export const extractFrontMatter = <
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
  const fieldRegex = /^([\w\s]+):(.*)/gm;
  let fieldMatch: RegExpExecArray | null = null;
  while ((fieldMatch = fieldRegex.exec(frontMatterString)) !== null) {
    const fieldName = fieldMatch[1];
    const fieldValue = fieldMatch[2];
    verifyFieldNameConvention(fieldName);
    verifyFieldValueConvention(fieldValue);

    mandatoryFields.delete(fieldName as MandatoryFields);

    fields[fieldName] = fieldValue;
  }
  if (mandatoryFields.size === 0)
    return fields as FrontMatter<MandatoryFields, OptionalFields>;
  throw new Error(
    `Missing mandatory fields in front matter: >>>${[...mandatoryFields].join(
      "<<<, >>>",
    )}<<<`,
  );
};
