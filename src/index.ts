import { getMarkdownContentWithMetadata } from "@engine/ingestor";
import {
  ProcessedData,
  Settings,
  processMarkdownContent,
} from "@engine/processor";
import { DirectoryStructure } from "@engine/processor/validators/validate_directory_structure";
import { ZodSchema } from "zod";

export const main = <FrontMatterSchema extends Record<string, string>>(
  directory: string,
  frontMatterSchema: ZodSchema<FrontMatterSchema>,
  settings?: Settings,
  directoryStructure?: DirectoryStructure,
): ProcessedData<FrontMatterSchema>[] => {
  return processMarkdownContent(
    getMarkdownContentWithMetadata(directory),
    frontMatterSchema,
    settings,
    directoryStructure,
  );

  // const metadataSchema = z.object({
  //   title: z.string().min(4).max(70),
  //   desc: z.string().min(20).max(150),
  //   priority: z.number(),
  // });
  // export interface DocObject {
  //   title: string;
  //   desc: string;
  //   content: string;
  //   createdDate: Date;
  //   updatedDate: Date;
  //   path: string;
  //   fileType: string;
  //   priority: number;
  // }
  // export interface Metadata {
  //   title: string;
  //   desc: string;
  //   priority: number;
  // }
};
