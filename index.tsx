import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";

import App from "./src/app/App";

const renderer = await createCliRenderer({ exitOnCtrlC: true });

try {
    createRoot(renderer).render(<App renderer={renderer} />);
    await renderer.closed;
} finally {
    renderer.destroy();
}