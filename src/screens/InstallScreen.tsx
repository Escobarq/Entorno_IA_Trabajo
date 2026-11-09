import { useState } from "react";

import { useKeyboard, useTerminalDimensions } from "@opentui/react";

import {
    CURRENT_OS,
    INSTALL_TOOL_CATEGORIES,
    INSTALL_TOOLS,
} from "../data/installTools";
import type { InstallTool } from "../data/installTools";

const OS_LABELS = {
    windows: "Windows",
    linux: "Linux",
    macos: "macOS",
};

function InstallScreen({
    onBack,
    onInstall,
}: {
    onBack: () => void;
    onInstall: (tool: InstallTool) => void;
}) {
    const { width } = useTerminalDimensions();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const contentWidth = Math.max(1, Math.min(width - 4, 72));
    const selectedTool = INSTALL_TOOLS[selectedIndex] ?? INSTALL_TOOLS[0];

    if (!selectedTool) {
        return (
            <box
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="100%"
            >
                <text>No hay herramientas disponibles.</text>
            </box>
        );
    }

    useKeyboard((event) => {
        if (event.name === "escape") {
            onBack();
            return;
        }

        if (event.name === "up") {
            setSelectedIndex((current) =>
                (current - 1 + INSTALL_TOOLS.length) % INSTALL_TOOLS.length,
            );
            return;
        }

        if (event.name === "down") {
            setSelectedIndex((current) => (current + 1) % INSTALL_TOOLS.length);
            return;
        }

        if (event.name === "return" || event.name === "space") {
            const tool = INSTALL_TOOLS[selectedIndex];
            if (tool) {
                onInstall(tool);
            }
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
            <box
                flexDirection="column"
                alignItems="center"
                gap={1}
                width={contentWidth}
            >
                <text>
                    <strong fg="#F2C14E">Catalogo de instalacion</strong>
                </text>
                <text fg="#93AAA6">Sistema detectado: {OS_LABELS[CURRENT_OS]}</text>
                <text fg="#426B66">{"-".repeat(contentWidth)}</text>
                <text fg="#93AAA6">Teclas: ↑ ↓ para mover • Enter para ver logs • Esc para volver</text>

                {INSTALL_TOOL_CATEGORIES.map(({ id, label }) => {
                    const tools = INSTALL_TOOLS.flatMap((tool, index) =>
                        tool.category === id ? [{ tool, index }] : [],
                    );

                    if (tools.length === 0) {
                        return null;
                    }

                    return (
                        <box key={id} flexDirection="column" gap={0}>
                            <text fg="#48DCC3"><strong>{label}</strong></text>
                            {tools.map(({ tool, index }) => {
                                const isSelected = index === selectedIndex;

                                return (
                                    <text key={tool.name} fg={isSelected ? "#F2C14E" : "#FFFFFF"}>
                                        {isSelected ? ">" : " "}
                                        {tool.icon} {tool.name}
                                    </text>
                                );
                            })}
                        </box>
                    );
                })}

                <text fg="#93AAA6">{selectedTool.icon} {selectedTool.description}</text>
            </box>
        </box>
    );
}

export default InstallScreen;
