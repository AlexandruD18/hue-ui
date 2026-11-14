import { checks } from "../color/checks";
import { derive } from "../color/derive";
import { ROLES } from "../color/generate";
import { HISTORY_LIMIT, initialState, reducer } from "./reducer";

const allPass = (s: ReturnType<typeof initialState>) =>
    checks(s.palette, derive(s.palette)).every((c) => c.level !== "Fails");

describe("reducer", () => {
    it("US1: parte con una palette pronta e valida", () => {
        const s = initialState(1);
        expect(s.history).toEqual([]);
        expect(allPass(s)).toBe(true);
    });

    it("US2/US3: genera e lascia fermi i colori bloccati", () => {
        let s = initialState(2);
        s = reducer(s, { type: "toggleLock", role: "primary" });
        const primary = s.palette.primary;
        s = reducer(s, { type: "generate", seed: 3 });
        expect(s.palette.primary).toBe(primary);
        expect(s.event?.type).toBe("generated");
        expect(allPass(s)).toBe(true);
    });

    it("US4: Undo torna indietro e la cronologia tiene al massimo 20 palette", () => {
        let s = initialState(4);
        const first = s.palette;
        s = reducer(s, { type: "generate", seed: 5 });
        s = reducer(s, { type: "undo" });
        expect(s.palette).toEqual(first);
        expect(s.history).toHaveLength(0);
        expect(reducer(s, { type: "undo" })).toBe(s);
        for (let i = 0; i < 30; i++) s = reducer(s, { type: "generate", seed: 100 + i });
        expect(s.history).toHaveLength(HISTORY_LIMIT);
    });

    it("US7: con tutto bloccato non cambia la palette e segnala l'evento", () => {
        let s = initialState(6);
        for (const r of ROLES) s = reducer(s, { type: "toggleLock", role: r });
        const next = reducer(s, { type: "generate", seed: 7 });
        expect(next.palette).toEqual(s.palette);
        expect(next.event?.type).toBe("allLocked");
    });

    it("US5: il colore scritto si blocca e gli altri si adattano", () => {
        let s = initialState(8);
        s = reducer(s, { type: "setColor", role: "background", hex: "#ffffff" });
        expect(s.palette.background).toBe("#ffffff");
        expect(s.locks.background).toBe(true);
        expect(allPass(s)).toBe(true);
    });

    it("US13: Apply fix cambia il colore senza toccare il blocco", () => {
        let s = initialState(9);
        s = reducer(s, { type: "applyFix", role: "primary", hex: "#2c6a58" });
        expect(s.palette.primary).toBe("#2c6a58");
        expect(s.locks.primary).toBe(false);
        expect(s.event?.type).toBe("fixed");
    });

    it("load sostituisce la palette e toglie i blocchi", () => {
        let s = reducer(initialState(10), { type: "toggleLock", role: "text" });
        const p = initialState(11).palette;
        s = reducer(s, { type: "load", palette: p });
        expect(s.palette).toEqual(p);
        expect(s.locks.text).toBe(false);
    });
});
