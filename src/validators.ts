import { Metadata } from "./types";
import z from "zod";

const metadataSchema = z.object({
  title: z.string().min(4).max(70),
  desc: z.string().min(20).max(150),
  priority: z.number(),
});

const extensionsToValidate = [".md", ".tex"];

const validateData = (data: any, extension: string): Metadata => {
  if (extensionsToValidate.includes(extension)) metadataSchema.parse(data);
  return data as Metadata;
};

export { validateData };
