import { AI_MODELS } from "../data/aiModels";

function ModelCatalog({ width }: { width: number }) {
    const modelsPerRow = width >= 56 ? 4 : 2;
    const rows = Array.from(
        { length: Math.ceil(AI_MODELS.length / modelsPerRow) },
        (_, rowIndex) =>
            AI_MODELS.slice(
                rowIndex * modelsPerRow,
                (rowIndex + 1) * modelsPerRow,
            ),
    );

    return (
        <box flexDirection="column" alignItems="center" gap={1} width={width}>
            <text><strong fg="#F2C14E">Asistentes y modelos</strong></text>
            {rows.map((models, rowIndex) => (
                <text key={rowIndex} fg="#48DCC3">
                    {models.map(({ icon, name }) => `${icon} ${name}`).join("  |  ")}
                </text>
            ))}
        </box>
    );
}

export default ModelCatalog;