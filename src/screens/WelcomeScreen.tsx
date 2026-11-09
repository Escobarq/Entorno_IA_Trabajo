import { useKeyboard, useTerminalDimensions } from "@opentui/react";

import ModelMarquee from "../components/ModelMarquee";

function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
    const { width } = useTerminalDimensions();
    const contentWidth = Math.max(1, Math.min(width - 4, 72));

    useKeyboard((event) => {
        if (event.name === "return" || event.name === "i") {
            onContinue();
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
                    <strong fg="#F2C14E">Bienvenido.</strong>
                </text>
                <text>Entorno base para IA</text>
                <text fg="#93AAA6">Bun / Node.js / Python</text>
                <text fg="#426B66">{"-".repeat(contentWidth)}</text>
                <ModelMarquee width={contentWidth} />
                <text fg="#F2C14E">Primeros pasos</text>
                <text>Preparando entorno</text>
                <text fg="#93AAA6">Enter para continuar</text>
            </box>
        </box>
    );
}

export default WelcomeScreen;
