import { converter, formatHex } from "culori";
import { parseHex, type Hex } from "./hex";
import { hexToOklch, oklchToHex } from "./oklch";
import { contrast, level, truncate1 } from "./contrast";
import { fitLightness } from "./fit";
import { mulberry32 } from "./rng";
import { generate, solve, ROLES, type Locks, type Palette, type Role } from "./generate";
import { derive } from "./derive";
import { checks } from "./checks";
import { suggestFix } from "./fix";

// Casi di test da docs/04 - Specifiche tecniche.md § 5 (T15, l'URL, arriva con US18).

const randomHex = (rng: () => number): Hex =>
    ("#" +
        Array.from({ length: 3 }, () =>
            Math.floor(rng() * 256)
                .toString(16)
                .padStart(2, "0"),
        ).join("")) as Hex;

const NO_LOCKS: Locks = { background: false, surface: false, text: false, primary: false, accent: false };
const START: Palette = {
    background: "#ffffff",
    surface: "#ffffff",
    text: "#000000",
    primary: "#3355dd",
    accent: "#dd5533",
};

describe("contrasto (T1-T3)", () => {
    it("T1: nero su bianco vale 21", () => {
        expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 5);
    });

    it("T2: #777777 su bianco vale 4,48", () => {
        expect(contrast("#777777", "#ffffff")).toBeCloseTo(4.48, 2);
    });

    it("T3: è simmetrico", () => {
        const rng = mulberry32(3);
        for (let i = 0; i < 1000; i++) {
            const a = randomHex(rng);
            const b = randomHex(rng);
            expect(contrast(a, b)).toBe(contrast(b, a));
        }
    });

    it("assegna i livelli con le soglie WCAG", () => {
        expect(level(7, 4.5)).toBe("AAA");
        expect(level(4.5, 4.5)).toBe("AA");
        expect(level(4.49, 4.5)).toBe("Fails");
        expect(level(3, 3)).toBe("UI");
        expect(level(2.99, 3)).toBe("Fails");
    });
});

describe("codici HEX (T4-T5)", () => {
    it("T4: accetta #RGB, RRGGBB e maiuscole", () => {
        expect(parseHex("#35d")).toBe("#3355dd");
        expect(parseHex("3355DD")).toBe("#3355dd");
        expect(parseHex("  #3355dd ")).toBe("#3355dd");
    });

    it("T5: rifiuta codici non validi", () => {
        expect(parseHex("#12345")).toBeNull();
        expect(parseHex("blue")).toBeNull();
        expect(parseHex("")).toBeNull();
        expect(parseHex("#ggg")).toBeNull();
    });
});

describe("OKLCH (T6-T7)", () => {
    it("T6: andata e ritorno senza perdite su 10.000 colori", () => {
        const rng = mulberry32(6);
        for (let i = 0; i < 10_000; i++) {
            const hex = randomHex(rng);
            expect(oklchToHex(hexToOklch(hex))).toBe(hex);
        }
    });

    it("T7: uguale a culori entro 0,001", () => {
        const toOklch = converter("oklch");
        const rng = mulberry32(7);
        for (let i = 0; i < 1000; i++) {
            const hex = randomHex(rng);
            const ours = hexToOklch(hex);
            const ref = toOklch(hex);
            if (!ref) throw new Error("culori non ha convertito " + hex);
            expect(ours.l).toBeCloseTo(ref.l, 3);
            expect(ours.c).toBeCloseTo(ref.c, 3);
            if (ref.c > 0.01 && ref.h !== undefined) {
                const dh = Math.abs(((ours.h - ref.h + 540) % 360) - 180);
                expect(dh).toBeLessThan(0.1);
            }
        }
        expect(formatHex(toOklch("#3355dd"))).toBe("#3355dd");
    });
});

const allPass = (p: Palette) => checks(p, derive(p)).every((c) => c.level !== "Fails");

describe("generatore (T8-T12)", () => {
    it("T8: 10.000 palette senza blocchi, nessuna coppia sotto soglia", () => {
        const rng = mulberry32(8);
        let prev = START;
        for (let i = 0; i < 10_000; i++) {
            prev = generate(prev, NO_LOCKS, rng).palette;
            if (!allPass(prev)) throw new Error("coppia sotto soglia: " + JSON.stringify(prev));
        }
    });

    it("T9: 10.000 palette con blocchi casuali su palette valide; i bloccati non cambiano", () => {
        const rng = mulberry32(9);
        let prev = generate(START, NO_LOCKS, rng).palette;
        for (let i = 0; i < 10_000; i++) {
            const locks = Object.fromEntries(ROLES.map((r) => [r, rng() < 0.3])) as Locks;
            const next = generate(prev, locks, rng).palette;
            for (const r of ROLES) if (locks[r]) expect(next[r]).toBe(prev[r]);
            if (!allPass(next))
                throw new Error("coppia sotto soglia: " + JSON.stringify({ prev, locks, next }));
            prev = next;
        }
    });

    it("T10: con tutti i colori bloccati la palette non cambia", () => {
        const all: Locks = { background: true, surface: true, text: true, primary: true, accent: true };
        const p = generate(START, NO_LOCKS, mulberry32(10)).palette;
        expect(generate(p, all, mulberry32(11)).palette).toEqual(p);
    });

    it("T11: stesso seme e stessi blocchi danno la stessa palette", () => {
        const a = generate(START, NO_LOCKS, mulberry32(42));
        const b = generate(START, NO_LOCKS, mulberry32(42));
        expect(a).toEqual(b);
    });

    it("T12: tra il 35% e il 65% delle palette ha lo sfondo scuro", () => {
        const rng = mulberry32(12);
        let dark = 0;
        let prev = START;
        for (let i = 0; i < 1000; i++) {
            prev = generate(prev, NO_LOCKS, rng).palette;
            if (hexToOklch(prev.background).l < 0.6) dark++;
        }
        expect(dark).toBeGreaterThanOrEqual(350);
        expect(dark).toBeLessThanOrEqual(650);
    });

    it("con lo sfondo bloccato il modo segue lo sfondo", () => {
        const locks = { ...NO_LOCKS, background: true };
        const rng = mulberry32(13);
        for (let i = 0; i < 200; i++) {
            const p = generate({ ...START, background: "#101114" }, locks, rng).palette;
            expect(hexToOklch(p.text).l).toBeGreaterThan(0.6);
        }
    });

    it("registra le correzioni dei colori non bloccati", () => {
        const rng = mulberry32(14);
        let seen = 0;
        let prev = START;
        for (let i = 0; i < 500; i++) {
            const { palette, adjusted } = generate(prev, NO_LOCKS, rng);
            for (const [role, adj] of Object.entries(adjusted)) {
                expect(adj.to).toBe(palette[role as keyof Palette]);
                expect(adj.from).not.toBe(adj.to);
                seen++;
            }
            prev = palette;
        }
        expect(seen).toBeGreaterThan(0);
    });
});

describe("ruoli ricavati e correzioni (T13-T14)", () => {
    it("T13: Muted text passa 4,5:1 su Background e Surface", () => {
        const rng = mulberry32(15);
        let prev = START;
        for (let i = 0; i < 2000; i++) {
            prev = generate(prev, NO_LOCKS, rng).palette;
            const d = derive(prev);
            expect(contrast(d.mutedText, prev.background)).toBeGreaterThanOrEqual(4.5);
            expect(contrast(d.mutedText, prev.surface)).toBeGreaterThanOrEqual(4.5);
        }
    });

    it("T14: la correzione di una coppia in conflitto ha la stessa tinta e passa", () => {
        const p: Palette = { ...START, background: "#ffffff", primary: "#8fa8ff" };
        const fail = checks(p, derive(p)).find((c) => c.id === "primary-bg");
        if (!fail) throw new Error("coppia primary-bg mancante");
        expect(fail.level).toBe("Fails");
        const fix = suggestFix(fail, p, derive(p));
        expect(fix.role).toBe("primary");
        expect(contrast(fix.hex, p.background)).toBeGreaterThanOrEqual(3);
        const dh = Math.abs(((hexToOklch(fix.hex).h - hexToOklch(p.primary).h + 540) % 360) - 180);
        expect(dh).toBeLessThan(3);
    });
});

describe("casi limite", () => {
    it("tronca il rapporto a un decimale senza arrotondare", () => {
        expect(truncate1(4.58)).toBe(4.5);
        expect(truncate1(21)).toBe(21);
    });

    it("fitLightness restituisce null se nessuna luminosità basta", () => {
        // nessun colore arriva a 5:1 sia sul nero sia sul bianco
        expect(fitLightness(hexToOklch("#808080"), ["#000000", "#ffffff"], 5)).toBeNull();
    });

    it("se il primo piano è un ruolo ricavato, la correzione cambia lo sfondo", () => {
        const p: Palette = { ...START, background: "#777777", surface: "#777777", text: "#888888" };
        const d = derive(p);
        const muted = checks(p, d).find((c) => c.id === "muted-bg");
        if (!muted) throw new Error("coppia muted-bg mancante");
        expect(muted.level).toBe("Fails");
        const fix = suggestFix(muted, p, d);
        expect(fix.role).toBe("background");
        expect(contrast(fix.hex, d.mutedText)).toBeGreaterThanOrEqual(4.5);
    });
});

describe("colore scritto a mano (revisione visiva 1.0, problema 1)", () => {
    const SHARED: Palette = {
        background: "#f7f4ee",
        surface: "#ece6dc",
        text: "#1c1b1a",
        primary: "#3e5bd0",
        accent: "#c2410c",
    };
    const NONE: Locks = { background: false, surface: false, text: false, primary: false, accent: false };
    const holds = (p: Palette) =>
        contrast(p.text, p.background) >= 4.5 &&
        contrast(p.text, p.surface) >= 4.5 &&
        contrast(p.primary, p.background) >= 3 &&
        contrast(p.accent, p.background) >= 3;

    it("un Accento chiaro non lascia lo sfondo su un grigio dove nessun testo si legge", () => {
        const { palette } = solve({ ...SHARED, accent: "#f0c0a0" }, { ...NONE, accent: true });
        expect(palette.accent).toBe("#f0c0a0");
        expect(holds(palette)).toBe(true);
    });

    it("con un solo colore fissato, su palette qualsiasi, tutti i vincoli passano", () => {
        const rng = mulberry32(7);
        const hex = () =>
            ("#" +
                Math.floor(rng() * 0xffffff)
                    .toString(16)
                    .padStart(6, "0")) as Hex;
        const fails: string[] = [];
        for (let i = 0; i < 3000; i++) {
            const start = Object.fromEntries(ROLES.map((r) => [r, hex()])) as Palette;
            const role = ROLES[Math.floor(rng() * ROLES.length)] as Role;
            const { palette } = solve(start, { ...NONE, [role]: true });
            if (palette[role] !== start[role] || !holds(palette))
                fails.push(`${role} ${JSON.stringify(start)}`);
        }
        expect(fails.slice(0, 5)).toEqual([]);
    });
});
