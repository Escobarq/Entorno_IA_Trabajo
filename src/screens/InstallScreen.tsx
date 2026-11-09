import { useState } from "react";

import { useKeyboard, useTerminalDimensions } from "@opentui/react";

import {
    CURRENT_OS,
    getRecommendedCommand,
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
                    <strong fg="#F2C14E">Herramientas base</strong>
                </text>
                <text fg="#93AAA6">Sistema detectado: {OS_LABELS[CURRENT_OS]}</text>
                <text fg="#426B66">{"-".repeat(contentWidth)}</text>
                <text fg="#93AAA6">Teclas: ↑ ↓ para mover • Enter para ver logs • Esc para volver</text>

                {INSTALL_TOOLS.map((tool, index) => {
                    const recommendedCommand = getRecommendedCommand(tool, CURRENT_OS);
                    const isSelected = index === selectedIndex;

                    return (
                        <box key={tool.name} flexDirection="column" width="100%" gap={1}>
                            <text>
                                <strong fg={isSelected ? "#F2C14E" : "#FFFFFF"}>
                                    {isSelected ? ">" : " "}
                                    {index + 1}. {tool.name}
                                </strong>
                                <span fg="#93AAA6"> {tool.description}</span>
                            </text>
                            <box flexDirection="column" paddingLeft={2}>
                                <text fg="#93AAA6">{recommendedCommand.platform}</text>
                                <text>{recommendedCommand.command}</text>
                            </box>
                        </box>
                    );
                })}
            </box>
        </box>
    );
}

export default InstallScreen;
