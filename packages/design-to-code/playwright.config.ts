import { PlaywrightTestConfig } from "@playwright/test";
const config: PlaywrightTestConfig = {
    testDir: "src",
    testMatch: "**/?(*.)+(spec).+(pw).+(ts)",
    globalSetup: "playwright.global-setup.ts",
    use: {
        baseURL: "http://localhost:7001",
    },
    webServer: {
        command: "npm run start",
        url: "http://localhost:7001",
        timeout: 240 * 1000,
        reuseExistingServer: !process.env.CI,
    },
    fullyParallel: true,
};
export default config;
