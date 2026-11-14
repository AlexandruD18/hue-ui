import type { Hex } from "./hex";
import { hexToOklch, oklchToHex, type Oklch } from "./oklch";
import { fitLightness, fitLightnessWhere, passes } from "./fit";
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

const BACKS = ["background", "surface"] as const;
// se il nero o il bianco si leggono, esiste un colore del testo che si legge
const TEXT_EXTREMES: readonly Hex[] = ["#000000", "#ffffff"];

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
    return solve(palette, locks);
}

/**
 * Passo 7: si adatta il colore libero di ogni coppia che non passa, solo nella luminosità.
 * Serve anche quando l'utente scrive un colore o applica una correzione. Le coppie tra due
 * colori bloccati restano come sono: lì decide l'utente.
 */
export function solve(start: Palette, locks: Locks): { palette: Palette; adjusted: Adjustments } {
    const palette = { ...start };
    const initial = { ...start };
    for (let round = 0; round < 6; round++) {
        let changed = false;
        // Surface libera sul lato opposto dello sfondo: nessun testo potrebbe leggersi su entrambe
        const bg = hexToOklch(palette.background);
        const surf = hexToOklch(palette.surface);
        if (!locks.surface && bg.l < 0.6 !== surf.l < 0.6) {
            const l = bg.l < 0.6 ? Math.min(1, bg.l + 0.04) : Math.max(0, bg.l - 0.04);
            palette.surface = oklchToHex({ l, c: bg.c, h: bg.h });
            changed = true;
        }
        // Sfondo e superficie liberi: rispettano i colori bloccati che stanno sopra di loro e lasciano
        // posto a un testo leggibile su entrambi. Senza la seconda condizione uno sfondo spinto a 3:1
        // da un Accento chiaro finiva su un grigio medio dove né il nero né il bianco arrivano a 4,5:1.
        for (const back of BACKS) {
            if (locks[back]) continue;
            const other = back === "background" ? "surface" : "background";
            const ok = (hex: Hex) =>
                CONSTRAINTS.every(
                    (c) => !locks[c.fg] || !c.backs.includes(back) || contrast(palette[c.fg], hex) >= c.min,
                ) &&
                (locks.text ||
                    TEXT_EXTREMES.some((t) =>
                        passes(
                            t,
                            back === "background" && !locks.surface ? [hex] : [hex, palette[other]],
                            4.5,
                        ),
                    ));
            if (ok(palette[back])) continue;
            const current = hexToOklch(palette[back]);
            let fixed = fitLightnessWhere(current, ok);
            // se per passare deve cambiare lato, va dove stanno i fondi veri (scuro o quasi bianco)
            // invece di fermarsi sul grigio medio al limite di ogni coppia
            const dark = fixed !== null && hexToOklch(fixed).l < 0.6;
            if (fixed && dark !== current.l < 0.6) {
                const mode = { l: dark ? 0.22 : 0.97, c: Math.min(current.c, 0.03), h: current.h };
                fixed = fitLightnessWhere(mode, ok) ?? fixed;
            }
            if (fixed && fixed !== palette[back]) {
                palette[back] = fixed;
                changed = true;
            }
        }
        for (const { fg, backs, min } of CONSTRAINTS) {
            const backColors = backs.map((b) => palette[b]);
            if (locks[fg] || passes(palette[fg], backColors, min)) continue;
            const current = hexToOklch(palette[fg]);
            let fixed = fitLightness(current, backColors, min);
            // il testo che cambia lato diventa un testo vero, non un grigio al limite di 4,5:1
            const light = fixed !== null && hexToOklch(fixed).l >= 0.6;
            if (fg === "text" && fixed && light !== current.l >= 0.6) {
                const mode = { l: light ? 0.95 : 0.2, c: Math.min(current.c, 0.02), h: current.h };
                fixed = fitLightness(mode, backColors, min) ?? fixed;
            }
            if (fixed && fixed !== palette[fg]) {
                palette[fg] = fixed;
                changed = true;
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
