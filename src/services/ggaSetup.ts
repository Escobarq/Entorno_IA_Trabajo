import { spawn } from "node:child_process";
import { constants } from "node:fs";
import { copyFile, lstat, readFile, writeFile } from "node:fs/promises";
import { delimiter, join } from "node:path";
import { homedir } from "node:os";

type OutputHandler = (text: string) => void;

function runCommand(
  command: string,
  args: string[],
  cwd: string,
  onOutput: OutputHandler,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const userBin = join(homedir(), "bin");
    const child = spawn(command, args, {
      cwd,
      shell: process.platform === "win32",
      env: {
        ...process.env,
        PATH: `${userBin}${delimiter}${process.env.PATH ?? ""}`,
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;
      onOutput(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      onOutput(text);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }

      reject(
        new Error(
          stderr.trim() ||
            `${command} terminó con código ${code ?? "desconocido"}.`,
        ),
      );
    });
  });
}

async function setOpenCodeProvider(configPath: string): Promise<void> {
  const configStat = await lstat(configPath);
  if (!configStat.isFile() || configStat.isSymbolicLink()) {
    throw new Error(
      "El archivo .gga no es un archivo regular; no se modificó.",
    );
  }

  const contents = await readFile(configPath, "utf8");
  const providerLines =
    contents.match(/^[\t ]*PROVIDER[\t ]*=[^\r\n]*$/gm) ?? [];

  if (providerLines.length > 1) {
    throw new Error(
      ".gga contiene varias asignaciones PROVIDER; revísalo manualmente.",
    );
  }

  const updated =
    providerLines.length === 1
      ? contents.replace(
          /^[\t ]*PROVIDER[\t ]*=[^\r\n]*$/m,
          'PROVIDER="opencode"',
        )
      : `${contents}${contents.endsWith("\n") || contents.length === 0 ? "" : "\n"}PROVIDER="opencode"\n`;

  await writeFile(configPath, updated, "utf8");
}

export async function configureGgaForOpenCode(
  workingDirectory: string,
  onOutput: OutputHandler,
): Promise<void> {
  const repositoryRoot = await runCommand(
    "git",
    ["rev-parse", "--show-toplevel"],
    workingDirectory,
    onOutput,
  );

  if (!repositoryRoot) {
    throw new Error(
      "No se pudo determinar la raíz del repositorio Git actual.",
    );
  }

  await runCommand("opencode", ["--version"], repositoryRoot, onOutput);
  await runCommand("gga", ["version"], repositoryRoot, onOutput);

  const configPath = join(repositoryRoot, ".gga");
  let configAlreadyExisted = false;
  try {
    await lstat(configPath);
    configAlreadyExisted = true;
  } catch (error) {
    if (
      !(error instanceof Error && "code" in error && error.code === "ENOENT")
    ) {
      throw error;
    }

    await runCommand("gga", ["init"], repositoryRoot, onOutput);
  }

  if (configAlreadyExisted) {
    const configStat = await lstat(configPath);
    if (!configStat.isFile() || configStat.isSymbolicLink()) {
      throw new Error(
        "El archivo .gga no es un archivo regular; no se modificó.",
      );
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = `${configPath}.backup-${timestamp}`;
    await copyFile(configPath, backupPath, constants.COPYFILE_EXCL);
    onOutput(`[INFO] Respaldo de .gga creado: ${backupPath}\n`);
  }

  await setOpenCodeProvider(configPath);
  onOutput("\n[OK] .gga configurado con PROVIDER=opencode.\n");
  await runCommand("gga", ["install"], repositoryRoot, onOutput);
}
