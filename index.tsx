import { spawn } from "node:child_process";
import { homedir } from "node:os";
import { delimiter, join } from "node:path";
import { format } from "node:util";
import { useState } from "react";

import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";

import {
  CURRENT_OS,
  getRecommendedCommand,
} from "./src/data/installTools";
import type { InstallTool } from "./src/data/installTools";
import InstallLogsScreen from "./src/screens/InstallLogsScreen";
import InstallScreen from "./src/screens/InstallScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import { configureGgaForOpenCode } from "./src/services/ggaSetup";

async function runInstallCommand(
  command: string,
  onData: (chunk: string) => void,
): Promise<number> {
  return await new Promise<number>((resolve, reject) => {
    const child = spawn(command, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      onData(text);
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      onData(text);
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(code ?? 0);
        return;
      }

      reject(new Error(`El comando terminó con código ${code ?? "desconocido"}.`));
    });
  });
}

async function runCommandOutput(command: string, args: string[]): Promise<string> {
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

      reject(new Error(stderr.trim() || `El comando terminó con código ${code ?? "desconocido"}.`));
    });
  });
}

async function findGentleAiExecutable(): Promise<string> {
  const goBin = await runCommandOutput("go", ["env", "GOBIN"]);
  const goPath = goBin || await runCommandOutput("go", ["env", "GOPATH"]);
  const installDirectory = goBin || join(goPath.split(delimiter)[0] ?? "", "bin");

  if (!installDirectory || installDirectory === "bin") {
    throw new Error("No se pudo determinar la carpeta de instalación de Go.");
  }

  const executableName = process.platform === "win32" ? "gentle-ai.exe" : "gentle-ai";
  return join(installDirectory, executableName);
}

async function runInteractiveCommand(
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

function getRtkEnvironment(): NodeJS.ProcessEnv {
  const extraPaths = [join(homedir(), ".local", "bin"), join(homedir(), "bin")];

  if (process.platform === "win32" && process.env.LOCALAPPDATA) {
    extraPaths.push(join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Links"));
  }

  return {
    ...process.env,
    PATH: [...extraPaths, process.env.PATH ?? ""].join(delimiter),
  };
}

function App() {
  const [screen, setScreen] = useState<"welcome" | "install" | "logs">("welcome");
  const [selectedTool, setSelectedTool] = useState<InstallTool | null>(null);
  const [logs, setLogs] = useState("");
  const [installationSucceeded, setInstallationSucceeded] = useState(false);
  const [isRunningPostInstallAction, setIsRunningPostInstallAction] = useState(false);

  const handleInstall = async (tool: InstallTool) => {
    const command = getRecommendedCommand(tool, CURRENT_OS);

    setSelectedTool(tool);
    setInstallationSucceeded(false);
    setLogs(`> ${command.command}\n`);
    setScreen("logs");

    if (command.interactive) {
      let shouldResumeRenderer = false;
      let resultMessage = "";

      try {
        await renderer.suspend();
        shouldResumeRenderer = true;

        const exitCode = await runInteractiveCommand(
          command.command,
          [],
          process.env,
          true,
        );
        resultMessage = exitCode === 0
          ? format("[OK] %s", "Configuracion de Context7 completada.")
          : format("[ERROR] %s", `El asistente de Context7 terminó con código ${exitCode}.`);
        setInstallationSucceeded(exitCode === 0);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        resultMessage = format("[ERROR] %s", `No se pudo configurar Context7: ${message}`);
      }

      if (shouldResumeRenderer) {
        try {
          await renderer.resume();
        } catch (error) {
          const message = error instanceof Error ? error.message : "Error desconocido";
          resultMessage = format("[ERROR] %s", `No se pudo restaurar la TUI: ${message}`);
          setInstallationSucceeded(false);
        }
      }

      setLogs((current) => `${current}\n${resultMessage}`);
      return;
    }

    try {
      await runInstallCommand(command.command, (chunk) => {
        setLogs((current) => `${current}${chunk}`);
      });
      setInstallationSucceeded(true);
      setLogs((current) => `${current}\n${format("[OK] %s", "Instalación completada.")}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setLogs((current) => `${current}\n${format("[ERROR] %s", message)}`);
    }
  };

  const handleConfigureGentleAI = async () => {
    setIsRunningPostInstallAction(true);
    let shouldResumeRenderer = false;
    let resultMessage = "";

    try {
      const executable = await findGentleAiExecutable();
      await renderer.suspend();
      shouldResumeRenderer = true;

      const exitCode = await runInteractiveCommand(executable);
      resultMessage = exitCode === 0
        ? format("[OK] %s", "Configurador de Gentle AI finalizado.")
        : format("[ERROR] %s", `El configurador terminó con código ${exitCode}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      resultMessage = format("[ERROR] %s", `No se pudo abrir Gentle AI: ${message}`);
    }

    if (shouldResumeRenderer) {
      try {
        await renderer.resume();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        resultMessage = format("[ERROR] %s", `No se pudo restaurar la TUI: ${message}`);
      }
    }

    setLogs((current) => `${current}\n${resultMessage}`);
    setIsRunningPostInstallAction(false);
  };

  const handleConfigureGga = async () => {
    setIsRunningPostInstallAction(true);
    setLogs((current) => `${current}\n[INFO] Configurando revisión en ${process.cwd()}\n`);

    try {
      await configureGgaForOpenCode(process.cwd(), (chunk) => {
        setLogs((current) => `${current}${chunk}`);
      });
      setLogs((current) => `${current}\n${format("[OK] %s", "Revisión OpenCode activada para los commits de este repositorio.")}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setLogs((current) => `${current}\n${format("[ERROR] %s", message)}`);
    }

    setIsRunningPostInstallAction(false);
  };

  const handleConfigureRtk = async () => {
    setIsRunningPostInstallAction(true);
    let shouldResumeRenderer = false;
    let resultMessage = "";

    try {
      await renderer.suspend();
      shouldResumeRenderer = true;

      const exitCode = await runInteractiveCommand(
        "rtk",
        ["init", "-g", "--opencode"],
        getRtkEnvironment(),
      );
      resultMessage = exitCode === 0
        ? format("[OK] %s", "Integración global de RTK con OpenCode completada.")
        : format("[ERROR] %s", `La configuración de RTK terminó con código ${exitCode}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      resultMessage = format("[ERROR] %s", `No se pudo configurar RTK: ${message}`);
    }

    if (shouldResumeRenderer) {
      try {
        await renderer.resume();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        resultMessage = format("[ERROR] %s", `No se pudo restaurar la TUI: ${message}`);
      }
    }

    setLogs((current) => `${current}\n${resultMessage}`);
    setIsRunningPostInstallAction(false);
  };

  const handlePostInstallAction = () => {
    if (selectedTool?.postInstallAction === "configure-gentle-ai") {
      void handleConfigureGentleAI();
      return;
    }

    if (selectedTool?.postInstallAction === "configure-gga-opencode") {
      void handleConfigureGga();
      return;
    }

    if (selectedTool?.postInstallAction === "configure-rtk-opencode") {
      void handleConfigureRtk();
    }
  };

  if (screen === "welcome") {
    return <WelcomeScreen onContinue={() => setScreen("install")} />;
  }

  if (screen === "logs" && selectedTool) {
    return (
      <InstallLogsScreen
        toolName={selectedTool.name}
        logs={logs}
        canConfigure={
          installationSucceeded && selectedTool.postInstallAction !== undefined
        }
        configureLabel={
          selectedTool.postInstallAction === "configure-gga-opencode"
            ? "C para activar revisión Git con OpenCode en este repo"
            : selectedTool.postInstallAction === "configure-rtk-opencode"
              ? "C para integrar RTK con OpenCode globalmente"
              : "C para configurar Gentle AI"
        }
        isConfiguring={isRunningPostInstallAction}
        onConfigure={handlePostInstallAction}
        onBack={() => {
          setSelectedTool(null);
          setLogs("");
          setInstallationSucceeded(false);
          setScreen("install");
        }}
      />
    );
  }

  return (
    <InstallScreen
      onBack={() => setScreen("welcome")}
      onInstall={handleInstall}
    />
  );
}

const renderer = await createCliRenderer({ exitOnCtrlC: true });

try {
  createRoot(renderer).render(<App />);
  await renderer.closed;
} finally {
  renderer.destroy();
}
