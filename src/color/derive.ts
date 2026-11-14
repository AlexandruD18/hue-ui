import type { Hex } from "./hex";
import { contrast } from "./contrast";
import { hexToOklch, mixOklch, oklchToHex, type Oklch } from "./oklch";
import { fitLightness, passes } from "./fit";
import type { Palette } from "./generate";

export interface Derived {
    mutedText: Hex;
    onPrimary: Hex;
    border: Hex;
    success: Hex;
    warning: Hex;
    error: Hex;
}

/** Il colore più lontano da `from`, verso `to`, che resta sopra `min` contro i fondi (passi di 0,02 in OKLCH). */
function mixUntil(from: Hex, to: Hex, backs: readonly Hex[], min: number): Hex {
    const a = hexToOklch(from);
    const b = hexToOklch(to);
    let best = from;
    for (let t = 0.02; t <= 1.0001; t += 0.02) {
        const c = oklchToHex(mixOklch(a, b, t));
        if (passes(c, backs, min)) best = c;
        else break;
    }
    return best;
}

// Tinte fisse degli stati; la luminosità si adatta a Background e Surface
const STATUS: Record<"success" | "warning" | "error", Omit<Oklch, "l">> = {
    success: { c: 0.14, h: 150 },
    warning: { c: 0.14, h: 70 },
    error: { c: 0.17, h: 27 },
};

/** Ruoli ricavati dai 5 colori scelti (02 § 3). */
export function derive(p: Palette): Derived {
    const dark = hexToOklch(p.background).l < 0.6;
    const status = (k: keyof typeof STATUS): Hex => {
        const base = { ...STATUS[k], l: dark ? 0.75 : 0.5 };
        return fitLightness(base, [p.background, p.surface], 3) ?? oklchToHex(base);
    };
    const best = (candidates: readonly Hex[]) =>
        candidates.reduce((a, c) => (contrast(c, p.primary) > contrast(a, p.primary) ? c : a));
    const fromPalette = best([p.background, p.text]);
    return {
        mutedText: mixUntil(p.text, p.background, [p.background, p.surface], 4.5),
        // Background o Text se bastano; altrimenti bianco o nero: uno dei due arriva sempre a 4,58:1
        onPrimary: contrast(fromPalette, p.primary) >= 4.5 ? fromPalette : best(["#ffffff", "#000000"]),
        border: mixUntil(p.text, p.background, [p.background], 3),
        success: status("success"),
        warning: status("warning"),
        error: status("error"),
    };
}
