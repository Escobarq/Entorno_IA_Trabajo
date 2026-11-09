export type OperatingSystem = "windows" | "linux" | "macos";

export type InstallCommand = {
  platform: string;
  command: string;
};

export type InstallTool = {
  name: string;
  icon: string;
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

export const CURRENT_OS = detectOperatingSystem();

export const INSTALL_TOOLS: InstallTool[] = [
  {
    name: "Bun",
    icon: "",
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
    icon: "",
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
    icon: "",
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
  {
    name: "UV",
    icon: "",
    description:
      "Gestor de proyectos y dependencias para Python, muy usado en entornos de IA",
    commands: [
      {
        platform: "Windows PowerShell",
        command:
          'powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"',
      },
      {
        platform: "Linux / macOS",
        command: "curl -LsSf https://astral.sh/uv/install.sh | sh",
      },
    ],
  },
  {
    name: "Golang",
    icon: "",
    description:
      "Lenguaje compilado para backends, CLIs y herramientas de sistema",
    commands: [
      {
        platform: "Windows",
        command: "winget install GoLang.Go",
      },
      {
        platform: "Linux / macOS",
        command: "sudo apt-get install -y golang || brew install go",
      },
    ],
  },
  {
    name: "Rust",
    icon: "",
    description: "Lenguaje seguro y rapido para sistemas y herramientas",
    commands: [
      {
        platform: "Windows",
        command: "winget install Rustlang.Rustup",
      },
      {
        platform: "Linux / macOS",
        command: "curl https://sh.rustup.rs -sSf | sh",
      },
    ],
  },
];
