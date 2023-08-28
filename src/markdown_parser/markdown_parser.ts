import type {
  FrontMatter,
  ParsedMarkdown,
  Settings,
  UriTransformer,
} from "@home/index.d";
import { extractFrontMatterAndContent } from "./extract_front_matter_and_content";
import { generateEnvTransformer } from "./uri_transformer/env_transformer";
import { generateLinkTransformer } from "./uri_transformer/link_transformer";

export class MarkdownParser<T = FrontMatter> {
  private linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  private uriTransformers: UriTransformer[];
  private settings: Settings<T>;

  constructor(settings: Settings<T>, allFilePaths: string[]) {
    this.settings = settings;
    this.uriTransformers = [
      generateEnvTransformer(settings.environmentVariables),
      generateLinkTransformer(settings.webPathPrefix, allFilePaths),
    ];
  }

  public parse(
    rawMarkdownContent: string,
    relativeMarkdownFilePath: string,
  ): ParsedMarkdown<T> {
    const { frontMatter, markdownContent } = extractFrontMatterAndContent<T>(
      rawMarkdownContent,
      this.settings.frontMatterSchema,
    );

    const transformedMarkdown = markdownContent.replace(
      this.linkRegex,
      (fullMatch: string, title: string, matchedPath: string) => {
        let result = null;
        for (const transformer of this.uriTransformers) {
          result = transformer(
            matchedPath,
            title,
            relativeMarkdownFilePath,
            markdownContent,
          );
          if (result !== null)
            return `[${result.transformedContent}](${result.transformedUri})`;
        }
        throw new Error(`
No transformer found for the following:
  Matched Path: ${fullMatch}
  File: ${relativeMarkdownFilePath}`);
      },
    );

    return {
      frontMatter,
      markdownContent: transformedMarkdown,
    };
  }
}
