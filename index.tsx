import { spawn } from "node:child_process";
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

function App() {
  const [screen, setScreen] = useState<"welcome" | "install" | "logs">("welcome");
  const [selectedTool, setSelectedTool] = useState<InstallTool | null>(null);
  const [logs, setLogs] = useState("");

  const handleInstall = async (tool: InstallTool) => {
    const command = getRecommendedCommand(tool, CURRENT_OS);

    setSelectedTool(tool);
    setLogs(`> ${command.command}\n`);
    setScreen("logs");

    try {
      await runInstallCommand(command.command, (chunk) => {
        setLogs((current) => `${current}${chunk}`);
      });
      setLogs((current) => `${current}\n${format("[OK] %s", "Instalación completada.")}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setLogs((current) => `${current}\n${format("[ERROR] %s", message)}`);
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
        onBack={() => {
          setSelectedTool(null);
          setLogs("");
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
