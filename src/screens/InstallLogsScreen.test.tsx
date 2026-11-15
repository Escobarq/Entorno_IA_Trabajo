import { expect, test } from "bun:test";

import { testRender } from "@opentui/react/test-utils";

import InstallLogsScreen from "./InstallLogsScreen";

test("does not leave the logs while an installation is running", async () => {
    let backCalls = 0;
    const screen = await testRender(
        <InstallLogsScreen
            toolName="Bun"
            logs="Installing..."
            isInstalling={true}
            canConfigure={false}
            configureLabel=""
            isConfiguring={false}
            onConfigure={() => {}}
            onBack={() => {
                backCalls += 1;
            }}
        />,
        { width: 80, height: 24 },
    );

    screen.mockInput.pressEscape();
    await screen.flush();

    expect(backCalls).toBe(0);

    await screen.dispose();
});

test("does not leave the logs while configuration is running", async () => {
    let backCalls = 0;
    const screen = await testRender(
        <InstallLogsScreen
            toolName="RTK"
            logs="Configuring..."
            isInstalling={false}
            canConfigure={true}
            configureLabel="C para configurar"
            isConfiguring={true}
            onConfigure={() => {}}
            onBack={() => {
                backCalls += 1;
            }}
        />,
        { width: 80, height: 24 },
    );

    screen.mockInput.pressEscape();
    await screen.flush();

    expect(backCalls).toBe(0);

    await screen.dispose();
});
