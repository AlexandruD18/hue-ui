/// <reference types="@testing-library/jest-dom/vitest" />
// I matcher di jest-dom vanno registrati sull'expect globale (globals: true in vite.config.ts).
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

// jsdom non implementa matchMedia e ResizeObserver: versioni minime per i test
if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
        ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: () => false,
        }) as MediaQueryList;
}
const w = window as unknown as { ResizeObserver?: unknown };
if (!w.ResizeObserver) {
    w.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}
