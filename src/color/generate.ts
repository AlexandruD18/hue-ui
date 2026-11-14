import type { Hex } from "./hex";
import { hexToOklch, oklchToHex, type Oklch } from "./oklch";
import { fitLightness, passes } from "./fit";
import { contrast } from "./contrast";

export type Role = "background" | "surface" | "text" | "primary" | "accent";
export const ROLES: readonly Role[] = ["background", "surface", "text", "primary", "accent"];
export type Palette = Record<Role, Hex>;
export type Locks = Record<Role, boolean>;
export interface Adjustment {
    from: Hex;
    to: Hex;
}
export type Adjustments = Partial<Record<Role, Adjustment>>;

// Scarti di tinta per l'accento: analoga, complementare, triadica, complementare divisa
const HARMONY = [30, -30, 180, 120, -120, 150, 210] as const;

// Coppie da rispettare, nell'ordine di risoluzione (04 § 5, passo 7)
const CONSTRAINTS: readonly { fg: Role; backs: readonly Role[]; min: 4.5 | 3 }[] = [
    { fg: "text", backs: ["background", "surface"], min: 4.5 },
    { fg: "primary", backs: ["background"], min: 3 },
    { fg: "accent", backs: ["background"], min: 3 },
];

// Sfondi tipici dei due modi, per capire dove un Primary o un Accent bloccato si legge
const LIGHT_BG: Hex = "#f4f4f4";
const DARK_BG: Hex = "#1c1c1c";

/** Con Primary o Accent bloccati sceglie il modo in cui si leggono; se vanno bene entrambi, a caso. */
function pickModeForAccents(prev: Palette, locks: Locks, rng: () => number): boolean {
    const fixed = (["primary", "accent"] as const).filter((r) => locks[r]).map((r) => prev[r]);
    const coin = rng() < 0.5;
    if (!fixed.length) return coin;
    const onLight = Math.min(...fixed.map((c) => contrast(c, LIGHT_BG)));
    const onDark = Math.min(...fixed.map((c) => contrast(c, DARK_BG)));
    if (onLight >= 3 && onDark >= 3) return coin;
    return onDark > onLight;
}

/**
 * Nuova palette: i colori bloccati restano identici, gli altri si generano in OKLCH e poi si
 * corregge solo la luminosità finché ogni coppia passa. Funzione pura: stesso `rng`, stesso risultato.
 */
export function generate(
    prev: Palette,
    locks: Locks,
    rng: () => number,
): { palette: Palette; adjusted: Adjustments } {
    if (ROLES.every((r) => locks[r])) return { palette: { ...prev }, adjusted: {} };
    const range = (a: number, b: number) => a + (b - a) * rng();

    // 1. modo chiaro o scuro: segue i colori bloccati (sfondo, poi superficie, poi testo), altrimenti 50%
    const dark = locks.background
        ? hexToOklch(prev.background).l < 0.6
        : locks.surface
          ? hexToOklch(prev.surface).l < 0.6
          : locks.text
            ? hexToOklch(prev.text).l > 0.6
            : pickModeForAccents(prev, locks, rng);

    // 2-6. bozza in OKLCH
    const bg: Oklch = locks.background
        ? hexToOklch(prev.background)
        : dark
          ? { l: range(0.14, 0.22), c: range(0, 0.04), h: rng() * 360 }
          : { l: range(0.95, 0.99), c: range(0, 0.03), h: rng() * 360 };
    const surface: Oklch = dark
        ? { l: bg.l + range(0.03, 0.06), c: bg.c, h: bg.h }
        : rng() < 0.5
          ? { l: 1, c: 0, h: 0 }
          : { l: bg.l - range(0.03, 0.06), c: bg.c, h: bg.h };
    const text: Oklch = dark
        ? { l: range(0.92, 0.97), c: range(0, 0.03), h: bg.h }
        : { l: range(0.15, 0.25), c: range(0, 0.03), h: bg.h };
    // Primario e accento partono da un intervallo ampio: più varietà, e la correzione scatta quando serve
    const primary: Oklch = {
        l: dark ? range(0.5, 0.85) : range(0.35, 0.72),
        c: range(0.12, 0.2),
        h: rng() * 360,
    };
    const offset = HARMONY[Math.floor(rng() * HARMONY.length)] ?? 180;
    const accent: Oklch = {
        l: dark ? range(0.5, 0.85) : range(0.4, 0.75),
        c: range(0.1, 0.18),
        h: (primary.h + offset + 360) % 360,
    };
    const draft: Record<Role, Oklch> = { background: bg, surface, text, primary, accent };

    const palette = {} as Palette;
    for (const r of ROLES) palette[r] = locks[r] ? prev[r] : oklchToHex(draft[r]);
    const initial = { ...palette };

    // 7. vincoli: si adatta il colore libero della coppia, solo nella luminosità
    for (let round = 0; round < 4; round++) {
        let changed = false;
        for (const { fg, backs, min } of CONSTRAINTS) {
            const backColors = backs.map((b) => palette[b]);
            if (passes(palette[fg], backColors, min)) continue;
            if (!locks[fg]) {
                const fixed = fitLightness(hexToOklch(palette[fg]), backColors, min);
                if (fixed && fixed !== palette[fg]) {
                    palette[fg] = fixed;
                    changed = true;
                }
                continue;
            }
            for (const b of backs) {
                if (locks[b] || passes(palette[fg], [palette[b]], min)) continue;
                const fixed = fitLightness(hexToOklch(palette[b]), [palette[fg]], min);
                if (fixed && fixed !== palette[b]) {
                    palette[b] = fixed;
                    changed = true;
                }
            }
        }
        if (!changed) break;
    }

    const adjusted: Adjustments = {};
    for (const r of ROLES) {
        if (!locks[r] && palette[r] !== initial[r]) adjusted[r] = { from: initial[r], to: palette[r] };
    }
    return { palette, adjusted };
}
