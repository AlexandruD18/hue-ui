import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// base: GitHub Pages pubblica il sito in /hue-ui/
export default defineConfig({
    base: "/hue-ui/",
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/test/setup.ts"],
        include: ["src/**/*.test.{ts,tsx}"],
        coverage: { provider: "v8", include: ["src/color/**", "src/state/**", "src/i18n/**"] },
    },
});
