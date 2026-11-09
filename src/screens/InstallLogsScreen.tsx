import { useKeyboard, useTerminalDimensions } from "@opentui/react";

function InstallLogsScreen({
  toolName,
  logs,
  onBack,
}: {
  toolName: string;
  logs: string;
  onBack: () => void;
}) {
  const { width } = useTerminalDimensions();
  const contentWidth = Math.max(1, Math.min(width - 4, 72));
  const logLines = logs.split("\n").slice(-18);

  useKeyboard((event) => {
    if (event.name === "escape") {
      onBack();
    }
  });

  return (
    <box
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      <box flexDirection="column" gap={1} width={contentWidth}>
        <text>
          <strong fg="#F2C14E">Instalación de {toolName}</strong>
        </text>
        <text fg="#93AAA6">
          Esta salida se muestra dentro de la app, sin mezclar la terminal del sistema.
        </text>
        <text fg="#426B66">{"-".repeat(contentWidth)}</text>

        <box flexDirection="column" gap={1}>
          {logLines.map((line, index) => (
            <text
              key={`${line}-${index}`}
              fg={
                line.includes("error") || line.includes("Error")
                  ? "#F87171"
                  : "#E5E7EB"
              }
            >
              {line || " "}
            </text>
          ))}
        </box>

        <text fg="#93AAA6">Presiona Esc para volver</text>
      </box>
    </box>
  );
}

export default InstallLogsScreen;
