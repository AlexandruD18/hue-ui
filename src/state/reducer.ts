import {
    generate,
    solve,
    ROLES,
    type Adjustments,
    type Locks,
    type Palette,
    type Role,
} from "../color/generate";
import { mulberry32 } from "../color/rng";
import type { Hex } from "../color/hex";

export const HISTORY_LIMIT = 20;

/** Ultimo evento: serve all'interfaccia per annunci e toast. `n` cambia a ogni evento. */
export type AppEvent =
    | { type: "generated" }
    | { type: "restored" }
    | { type: "allLocked" }
    | { type: "lock"; role: Role; locked: boolean }
    | { type: "set"; role: Role; hex: Hex }
    | { type: "fixed"; role: Role; hex: Hex }
    | { type: "loaded" };

export interface Snapshot {
    palette: Palette;
    adjusted: Adjustments;
}

export interface AppState extends Snapshot {
    locks: Locks;
    history: Snapshot[];
    event: (AppEvent & { n: number }) | null;
}

export type Action =
    | { type: "generate"; seed: number }
    | { type: "undo" }
    | { type: "toggleLock"; role: Role }
    | { type: "setColor"; role: Role; hex: Hex }
    | { type: "applyFix"; role: Role; hex: Hex }
    | { type: "load"; palette: Palette };

export const NO_LOCKS: Locks = {
    background: false,
    surface: false,
    text: false,
    primary: false,
    accent: false,
};

const SEED_PALETTE: Palette = {
    background: "#ffffff",
    surface: "#ffffff",
    text: "#000000",
    primary: "#3355dd",
    accent: "#dd5533",
};

/** Stato iniziale: una palette casuale già pronta (US1), nessun blocco, cronologia vuota. */
export function initialState(seed: number): AppState {
    const { palette, adjusted } = generate(SEED_PALETTE, NO_LOCKS, mulberry32(seed));
    return { palette, adjusted, locks: NO_LOCKS, history: [], event: null };
}

/** Stato iniziale da un link condiviso: la palette così com'è, senza blocchi. */
export const stateFromPalette = (palette: Palette): AppState => ({
    palette,
    adjusted: {},
    locks: NO_LOCKS,
    history: [],
    event: null,
});

const push = (s: AppState): Snapshot[] =>
    [...s.history, { palette: s.palette, adjusted: s.adjusted }].slice(-HISTORY_LIMIT);
const emit = (s: AppState, event: AppEvent): AppState["event"] => ({ ...event, n: (s.event?.n ?? 0) + 1 });

/** Reducer puro: ogni azione casuale porta con sé il seme, così è testabile e riproducibile. */
export function reducer(s: AppState, a: Action): AppState {
    switch (a.type) {
        case "generate": {
            if (ROLES.every((r) => s.locks[r])) return { ...s, event: emit(s, { type: "allLocked" }) };
            const next = generate(s.palette, s.locks, mulberry32(a.seed));
            return { ...s, ...next, history: push(s), event: emit(s, { type: "generated" }) };
        }
        case "undo": {
            const prev = s.history.at(-1);
            if (!prev) return s;
            return { ...s, ...prev, history: s.history.slice(0, -1), event: emit(s, { type: "restored" }) };
        }
        case "toggleLock": {
            const locked = !s.locks[a.role];
            return {
                ...s,
                locks: { ...s.locks, [a.role]: locked },
                event: emit(s, { type: "lock", role: a.role, locked }),
            };
        }
        case "setColor":
        case "applyFix": {
            // durante l'adattamento il colore scelto resta fermo; poi il colore scritto resta bloccato
            // (02 § 12), mentre la correzione lascia il blocco com'era
            const pinned = { ...s.locks, [a.role]: true };
            const { palette, adjusted } = solve({ ...s.palette, [a.role]: a.hex }, pinned);
            return {
                ...s,
                palette,
                adjusted,
                locks: a.type === "setColor" ? pinned : s.locks,
                history: push(s),
                event: emit(s, { type: a.type === "setColor" ? "set" : "fixed", role: a.role, hex: a.hex }),
            };
        }
        case "load":
            return {
                ...s,
                palette: a.palette,
                adjusted: {},
                locks: NO_LOCKS,
                event: emit(s, { type: "loaded" }),
            };
    }
}
