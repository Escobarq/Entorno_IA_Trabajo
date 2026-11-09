import { format } from "node:util";
import { useState } from "react";

import type { CliRenderer } from "@opentui/core";

import {
    CURRENT_OS,
    getRecommendedCommand,
} from "../data/installTools";
import type { InstallTool } from "../data/installTools";
import InstallLogsScreen from "../screens/InstallLogsScreen";
import InstallScreen from "../screens/InstallScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { configureGgaForOpenCode } from "../services/ggaSetup";
import {
    findGentleAiExecutable,
    getRtkEnvironment,
    runInstallCommand,
    runInteractiveCommand,
} from "../services/processRunner";

function App({ renderer }: { renderer: CliRenderer }) {
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

export default App;