export type OperatingSystem = "windows" | "linux" | "macos";

export type InstallCommand = {
  platform: string;
  command: string;
  recommended?: boolean;
};

export type InstallTool = {
  name: string;
  icon: string;
  category: "base" | "complement" | "gentleman-programming" | "token-savings";
  description: string;
  commands: InstallCommand[];
  postInstallAction?:
    | "configure-gentle-ai"
    | "configure-gga-opencode"
    | "configure-rtk-opencode";
};

export const INSTALL_TOOL_CATEGORIES = [
  { id: "base", label: "Entorno base" },
  { id: "complement", label: "Lenguajes y complementos" },
  { id: "gentleman-programming", label: "Gentleman Programming" },
  { id: "token-savings", label: "Herramientas para reducir el consumo" },
] as const;

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
  const explicitlyRecommended = tool.commands.find(
    ({ recommended }) => recommended,
  );

  if (explicitlyRecommended) {
    return explicitlyRecommended;
  }

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
    category: "base",
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
    category: "base",
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
    category: "base",
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
    name: "OpenCode",
    icon: "󰆍",
    category: "base",
    description: "Agente de codigo con IA para trabajar desde la terminal",
    commands: [
      {
        platform: "Bun (comando oficial)",
        command: "bun install -g --trust @opencode/cli",
        recommended: true,
      },
    ],
  },
  {
    name: "UV",
    icon: "",
    category: "complement",
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
    category: "complement",
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
    category: "complement",
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
  {
    name: "OpenSpec (SDD)",
    icon: "󰒓",
    category: "gentleman-programming",
    description: "CLI para desarrollo guiado por especificaciones",
    commands: [
      {
        platform: "Multiplataforma (Bun recomendado)",
        command: "bun add -g @fission-ai/openspec@latest",
        recommended: true,
      },
      {
        platform: "Windows PowerShell",
        command:
          'powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://openspec.dev/cli/install.ps1 | iex"',
      },
      {
        platform: "Linux / macOS",
        command: "curl -fsSL https://openspec.dev/cli/install.sh | sh",
      },
    ],
  },
  {
    name: "Engram",
    icon: "󰍛",
    category: "gentleman-programming",
    description: "Memoria persistente del proyecto para futuras sesiones de IA",
    commands: [
      {
        platform: "Windows",
        command:
          "go install github.com/Gentleman-Programming/engram/v3/cmd/engram@latest",
      },
      {
        platform: "Linux / macOS",
        command: "brew install gentleman-programming/tap/engram",
      },
    ],
  },
  {
    name: "Gentle AI",
    icon: "󰚩",
    category: "gentleman-programming",
    description: "Configura agentes existentes con memoria y flujos de trabajo",
    postInstallAction: "configure-gentle-ai",
    commands: [
      {
        platform: "Linux / macOS",
        command:
          "go install github.com/gentleman-programming/gentle-ai/v4/cmd/gentle-ai@main",
      },
      {
        platform: "Windows",
        command:
          "go install github.com/gentleman-programming/gentle-ai/v4/cmd/gentle-ai@main",
      },
    ],
  },
  {
    name: "Gentleman Guardian Angel",
    icon: "󰒃",
    category: "gentleman-programming",
    description: "Revisa los cambios staged con OpenCode antes de cada commit",
    postInstallAction: "configure-gga-opencode",
    commands: [
      {
        platform: "Linux / macOS",
        command: "brew install gentleman-programming/tap/gga",
      },
      {
        platform: "Windows (Git Bash requerido)",
        command:
          'if exist "%TEMP%\\gentleman-guardian-angel\\.git" (git -C "%TEMP%\\gentleman-guardian-angel" pull) else (git clone --depth 1 https://github.com/Gentleman-Programming/gentleman-guardian-angel.git "%TEMP%\\gentleman-guardian-angel") && bash "%TEMP%\\gentleman-guardian-angel\\install.sh"',
      },
    ],
  },
  {
    name: "RTK",
    icon: "󰈲",
    category: "token-savings",
    description: "Compacta salidas de comandos para reducir tokens de contexto",
    postInstallAction: "configure-rtk-opencode",
    commands: [
      {
        platform: "macOS / Linux",
        command: "brew install rtk",
      },
      {
        platform: "Windows",
        command: "winget install rtk-ai.rtk",
      },
      {
        platform: "Linux / macOS (instalador alternativo)",
        command:
          "curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh",
      },
    ],
  },
];
