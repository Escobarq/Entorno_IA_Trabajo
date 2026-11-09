import { spawn } from "node:child_process";
import { homedir } from "node:os";
import { delimiter, join } from "node:path";

export async function runInstallCommand(
  command: string,
  onData: (chunk: string) => void,
): Promise<number> {
  return await new Promise<number>((resolve, reject) => {
    const child = spawn(command, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (chunk) => onData(chunk.toString()));
    child.stderr.on("data", (chunk) => onData(chunk.toString()));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(code ?? 0);
        return;
      }

      reject(
        new Error(`El comando terminó con código ${code ?? "desconocido"}.`),
      );
    });
  });
}

async function runCommandOutput(
  command: string,
  args: string[],
): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
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
            `El comando terminó con código ${code ?? "desconocido"}.`,
        ),
      );
    });
  });
}

export async function findGentleAiExecutable(): Promise<string> {
  const goBin = await runCommandOutput("go", ["env", "GOBIN"]);
  const goPath = goBin || (await runCommandOutput("go", ["env", "GOPATH"]));
  const installDirectory =
    goBin || join(goPath.split(delimiter)[0] ?? "", "bin");

  if (!installDirectory || installDirectory === "bin") {
    throw new Error("No se pudo determinar la carpeta de instalación de Go.");
  }

  const executableName =
    process.platform === "win32" ? "gentle-ai.exe" : "gentle-ai";
  return join(installDirectory, executableName);
}

export async function runInteractiveCommand(
  executable: string,
  args: string[] = [],
  env?: NodeJS.ProcessEnv,
  shell = false,
): Promise<number> {
  return await new Promise<number>((resolve, reject) => {
    const child = spawn(executable, args, { stdio: "inherit", env, shell });

    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 1));
  });
}

export function getRtkEnvironment(): NodeJS.ProcessEnv {
  const extraPaths = [join(homedir(), ".local", "bin"), join(homedir(), "bin")];

  if (process.platform === "win32" && process.env.LOCALAPPDATA) {
    extraPaths.push(
      join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Links"),
    );
  }

  return {
    ...process.env,
    PATH: [...extraPaths, process.env.PATH ?? ""].join(delimiter),
  };
}
