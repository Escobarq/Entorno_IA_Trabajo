import { useEffect, useState } from "react";

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

const SPECIAL_KEYS = new Set([
    "return",
    "enter",
    "space",
    "escape",
    "up",
    "down",
    "left",
    "right",
    "backspace",
    "delete",
    "tab",
]);

function InstallScreen({
    onBack,
    onInstall,
}: {
    onBack: () => void;
    onInstall: (tool: InstallTool) => void;
}) {
    const { width } = useTerminalDimensions();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [filter, setFilter] = useState("");
    const [confirmingTool, setConfirmingTool] = useState<InstallTool | null>(
        null,
    );
    const contentWidth = Math.max(1, Math.min(width - 4, 72));

    const filteredTools = INSTALL_TOOLS.filter((tool) =>
        tool.name.toLowerCase().includes(filter.toLowerCase()) ||
        tool.description.toLowerCase().includes(filter.toLowerCase()),
    );

    useEffect(() => {
        if (selectedIndex >= filteredTools.length) {
            setSelectedIndex(Math.max(0, filteredTools.length - 1));
        }
    }, [filteredTools.length, selectedIndex]);

    const selectedTool = filteredTools[selectedIndex] ?? null;

    useKeyboard((event) => {
        if (confirmingTool) {
            if (event.name === "return" || event.name === "s") {
                onInstall(confirmingTool);
                setConfirmingTool(null);
                return;
            }

            if (event.name === "escape" || event.name === "n") {
                setConfirmingTool(null);
                return;
            }

            return;
        }

        if (filteredTools.length === 0) {
            if (event.name === "escape") {
                if (filter) {
                    setFilter("");
                    return;
                }
                onBack();
                return;
            }

            if (event.name === "backspace") {
                setFilter((current) => current.slice(0, -1));
                return;
            }

            if (
                !SPECIAL_KEYS.has(event.name) &&
                event.name.length >= 1
            ) {
                setFilter((current) => current + event.name);
            }

            return;
        }

        if (event.name === "backspace") {
            setFilter((current) => current.slice(0, -1));
            setSelectedIndex(0);
            return;
        }

        if (event.name === "escape") {
            if (filter) {
                setFilter("");
                setSelectedIndex(0);
                return;
            }
            onBack();
            return;
        }

        if (event.name === "up") {
            setSelectedIndex((current) =>
                (current - 1 + filteredTools.length) % filteredTools.length,
            );
            return;
        }

        if (event.name === "down") {
            setSelectedIndex((current) =>
                (current + 1) % filteredTools.length,
            );
            return;
        }

        if (event.name === "return" || event.name === "space") {
            if (selectedTool) {
                setConfirmingTool(selectedTool);
                return;
            }
        }

        if (!SPECIAL_KEYS.has(event.name) && event.name.length >= 1) {
            setFilter((current) => current + event.name);
            setSelectedIndex(0);
        }
    });

    if (!selectedTool || filteredTools.length === 0) {
        return (
            <box
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="100%"
            >
                <text>
                    No hay herramientas que coincidan con el filtro.
                </text>
                <text fg="#93AAA6">Presiona Esc para volver</text>
            </box>
        );
    }

    if (confirmingTool && selectedTool) {
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
                        <strong fg="#F2C14E">
                            ¿Instalar {confirmingTool.name}?
                        </strong>
                    </text>
                    <text fg="#93AAA6">
                        s = Sí  •  n = No  •  Esc = Cancelar
                    </text>
                </box>
            </box>
        );
    }

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
                <text fg="#93AAA6">
                    Sistema detectado: {OS_LABELS[CURRENT_OS]}
                </text>
                <text fg="#426B66">{`-`.repeat(contentWidth)}</text>

                <box flexDirection="row" alignItems="center" gap={1}>
                    <text fg="#48DCC3">› </text>
                    <text>{filter}</text>
                    <text fg="#93AAA6">(filtrar)</text>
                </box>
                <text fg="#93AAA6">
                    Teclas: ↑ ↓ para mover • Enter para confirmar instalación
                    • Esc para volver
                </text>

                {INSTALL_TOOL_CATEGORIES.map(({ id, label }) => {
                    const tools = filteredTools.filter(
                        (tool) => tool.category === id,
                    );

                    if (tools.length === 0) {
                        return null;
                    }

                    return (
                        <box key={id} flexDirection="column" gap={0}>
                            <text fg="#48DCC3">
                                <strong>{label}</strong>
                            </text>
                            {tools.map((tool) => {
                                const isSelected = tool === selectedTool;

                                return (
                                    <text
                                        key={tool.name}
                                        fg={isSelected ? "#F2C14E" : "#FFFFFF"}
                                    >
                                        {isSelected ? ">" : " "}
                                        {tool.icon} {tool.name}
                                    </text>
                                );
                            })}
                        </box>
                    );
                })}

                <text fg="#93AAA6">
                    {selectedTool.icon} {selectedTool.description}
                </text>
            </box>
        </box>
    );
}

export default InstallScreen;
