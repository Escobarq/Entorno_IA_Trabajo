export function appendLogLines(
  current: string,
  addition: string,
  maxLines: number,
): string {
  const combined = current
    ? `${current}\n${addition}`
    : addition;

  const lines = combined.split("\n");

  if (lines.length > maxLines) {
    return lines.slice(-maxLines).join("\n");
  }

  return combined;
}
