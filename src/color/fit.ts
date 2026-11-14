import { contrast } from "./contrast";
import type { Hex } from "./hex";
import { oklchToHex, type Oklch } from "./oklch";

export const passes = (color: Hex, backs: readonly Hex[], min: number) =>
    backs.every((b) => contrast(color, b) >= min);

/**
 * Il colore con la stessa tinta e la luminosità più vicina all'originale che raggiunge `min`
 * contro tutti i fondi. Cerca a passi di 0,005 verso lo scuro e verso il chiaro, alternando.
 * Restituisce null se nessuna luminosità basta.
 */
export function fitLightness(color: Oklch, backs: readonly Hex[], min: number): Hex | null {
    return fitLightnessWhere(color, (hex) => passes(hex, backs, min));
}

/** Come fitLightness, ma con una condizione qualsiasi: la luminosità più vicina per cui `ok` è vera. */
export function fitLightnessWhere(color: Oklch, ok: (hex: Hex) => boolean): Hex | null {
    const start = oklchToHex(color);
    if (ok(start)) return start;
    for (let step = 0.005; step <= 1; step += 0.005) {
        for (const l of [color.l - step, color.l + step]) {
            if (l < 0 || l > 1) continue;
            const hex = oklchToHex({ ...color, l });
            if (ok(hex)) return hex;
        }
    }
    for (const l of [0, 1]) {
        const hex = oklchToHex({ ...color, l });
        if (ok(hex)) return hex;
    }
    return null;
}
