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
        // le prove su 10.000 palette richiedono qualche secondo
        testTimeout: 30_000,
        coverage: {
            provider: "v8",
            include: ["src/color/**", "src/state/**", "src/i18n/**"],
            // i dizionari sono testi, non logica
            exclude: ["**/*.test.*", "src/i18n/en.ts", "src/i18n/it.ts"],
            // PRD § 7: logica colore e stato coperte almeno al 90%
            thresholds: { statements: 90, branches: 85, functions: 90, lines: 90 },
        },
    },
});
