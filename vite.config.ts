import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";

const BASE = "/hue-ui/";

/**
 * Precarica il file del carattere principale (latino, assi ottici). Senza, la pagina si disegna con il
 * carattere di riserva e, quando arriva Bricolage Grotesque, i testi del pannello si spostano di circa
 * 20 px: CLS 0,06 su Lighthouse. Il nome del file ha l'hash, quindi lo si cerca nel bundle finale.
 */
function preloadFont(): Plugin {
    return {
        name: "hue-preload-font",
        apply: "build",
        transformIndexHtml: {
            order: "post",
            handler(_html, ctx) {
                const file = Object.keys(ctx.bundle ?? {}).find((f) =>
                    /bricolage-grotesque-latin-opsz-normal-.*\.woff2$/.test(f),
                );
                if (!file) return [];
                return [
                    {
                        tag: "link",
                        attrs: {
                            rel: "preload",
                            href: BASE + file,
                            as: "font",
                            type: "font/woff2",
                            crossorigin: "",
                        },
                        injectTo: "head",
                    },
                ];
            },
        },
    };
}

// base: GitHub Pages pubblica il sito in /hue-ui/
export default defineConfig({
    base: BASE,
    plugins: [react(), preloadFont()],
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
