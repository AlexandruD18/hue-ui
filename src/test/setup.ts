/// <reference types="@testing-library/jest-dom/vitest" />
// I matcher di jest-dom vanno registrati sull'expect globale (globals: true in vite.config.ts).
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
