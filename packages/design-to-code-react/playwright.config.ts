import { devices, PlaywrightTestConfig } from "@playwright/test";
const port = 8080;
const config: PlaywrightTestConfig = {
    testDir: "src",
    forbidOnly: !!process.env.CI,
    retries: 3,
    use: {
        baseURL: `http://localhost:${port}`,
        viewport: {
            width: 1280,
            height: 720,
        },
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
            testMatch: "**/?(*.)+(spec).+(pw).+(ts)",
        },
    ],
    webServer: [
        {
            command: "npm run start:test",
            port,
            timeout: 120 * 1000,
        },
    ],
};
export default config;
