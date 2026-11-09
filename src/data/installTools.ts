export type OperatingSystem = "windows" | "linux" | "macos";

export type InstallCommand = {
  platform: string;
  command: string;
};

export type InstallTool = {
  name: string;
  description: string;
  commands: InstallCommand[];
};

export function detectOperatingSystem(): OperatingSystem {
  const platform = process.platform;

  if (platform === "win32") {
    return "windows";
  }

  if (platform === "darwin") {
    return "macos";
  }

  return "linux";
}

export function getRecommendedCommand(
  tool: InstallTool,
  currentSystem: OperatingSystem = detectOperatingSystem(),
): InstallCommand {
  const fallbackCommand: InstallCommand = {
    platform: "Sistema operativo",
    command: "No se encontró un comando de instalación para este entorno.",
  };

  if (currentSystem === "windows") {
    const command =
      tool.commands.find(({ platform }) =>
        platform.toLowerCase().includes("windows"),
      ) ??
      tool.commands[0] ??
      fallbackCommand;

    return command;
  }

  const command =
    tool.commands.find(
      ({ platform }) =>
        platform.toLowerCase().includes("linux") ||
        platform.toLowerCase().includes("macos"),
    ) ??
    tool.commands[0] ??
    fallbackCommand;

  return command;
}

export const MODEL_TRACK =
  "ChatGPT   /   Claude   /   Gemini   /   DeepSeek   /   Qwen   /   Mistral   /   Llama   /   ";

export const CURRENT_OS = detectOperatingSystem();

export const INSTALL_TOOLS: InstallTool[] = [
  {
    name: "Bun",
    description: "Runtime de JavaScript y TypeScript, y gestor de paquetes",
    commands: [
      {
        platform: "Windows PowerShell",
        command: 'powershell -c "irm bun.sh/install.ps1 | iex"',
      },
      {
        platform: "Linux / macOS",
        command: "curl -fsSL https://bun.sh/install | bash",
      },
    ],
  },
  {
    name: "Node.js",
    description:
      "Runtime principal para JavaScript y herramientas del ecosistema",
    commands: [
      {
        platform: "Windows",
        command: "winget install OpenJS.NodeJS.LTS",
      },
      {
        platform: "Linux / macOS",
        command:
          "curl -fsSL https://fnm.vercel.app/install | bash && fnm install --lts",
      },
    ],
  },
  {
    name: "Python",
    description: "Lenguaje de scripting, automatización y ciencia de datos",
    commands: [
      {
        platform: "Windows",
        command: "winget install Python.Python.3.12",
      },
      {
        platform: "Linux / macOS",
        command:
          "sudo apt-get install -y python3 python3-pip || brew install python",
      },
    ],
  },
];
