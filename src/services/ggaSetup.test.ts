import { expect, test } from "bun:test";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { mkdtemp, writeFile, unlink, rm, readdir } from "node:fs/promises";
import { setOpenCodeProvider } from "./ggaSetup";

test("setOpenCodeProvider updates PROVIDER atomically", async () => {
  const dir = await mkdtemp(join(tmpdir(), "gga-test-"));
  const configPath = join(dir, ".gga");

  await writeFile(configPath, 'PROVIDER="other"\n', "utf8");

  await setOpenCodeProvider(configPath);

  const contents = await Bun.file(configPath).text();
  expect(contents).toBe('PROVIDER="opencode"\n');

  const entries = await readdir(dir);
  expect(entries).not.toContain(expect.stringContaining(".tmp"));

  await rm(dir, { recursive: true, force: true });
});

test("setOpenCodeProvider appends PROVIDER when missing", async () => {
  const dir = await mkdtemp(join(tmpdir(), "gga-test-"));
  const configPath = join(dir, ".gga");

  await writeFile(configPath, "OTRA_COSA=1\n", "utf8");

  await setOpenCodeProvider(configPath);

  const contents = await Bun.file(configPath).text();
  expect(contents).toBe("OTRA_COSA=1\nPROVIDER=\"opencode\"\n");

  await rm(dir, { recursive: true, force: true });
});
