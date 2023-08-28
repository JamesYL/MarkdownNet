import { Settings } from "@home/*";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { z } from "zod";

export const createTmpDirectoryAndTest = async (
  run: (tmpDir: string) => Promise<unknown>,
): Promise<void> => {
  const tmpDir = mkdtempSync(join(tmpdir(), "markdown-net-temp-dir-"));
  await run(tmpDir);
  rmSync(tmpDir, { recursive: true });
};

export const getSettings: () => Settings = () => {
  return {
    directoryStructure: "",
    frontMatterSchema: z.object({}),
    environmentVariables: {},
    webPathPrefix: "/courses",
    entryDirectory: "",
  };
};
