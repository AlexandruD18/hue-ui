import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "tests/e2e",
    use: { baseURL: "http://localhost:4173/hue-ui/" },
    webServer: {
        command: "npm run preview -- --port 4173 --strictPort",
        url: "http://localhost:4173/hue-ui/",
        reuseExistingServer: !process.env.CI,
    },
    projects: [
        { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
        { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
    ],
});
