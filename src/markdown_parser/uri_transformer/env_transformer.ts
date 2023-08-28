import type { EnvironmentVariables, UriTransformer } from "@home/index.d";

export const generateEnvTransformer =
  (envVar: EnvironmentVariables): UriTransformer =>
  (matchedUri: string, matchedContent: string) => {
    if (matchedUri.startsWith("$")) {
      const withoutDollarSign = matchedUri.slice(1);
      if (withoutDollarSign in envVar)
        return {
          transformedUri: envVar[withoutDollarSign],
          transformedContent: matchedContent,
        };
    }
    return null;
  };
