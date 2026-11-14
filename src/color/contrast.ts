import { hexToRgb, type Hex } from "./hex";

export type Level = "AAA" | "AA" | "UI" | "Fails";

const channel = (v: number) => {
    const x = v / 255;
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};

/** Luminanza relativa WCAG 2.1. */
export function luminance(hex: Hex): number {
    const [r, g, b] = hexToRgb(hex).map(channel) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Rapporto di contrasto WCAG 2.1, da 1 a 21. */
export function contrast(a: Hex, b: Hex): number {
    const la = luminance(a);
    const lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Esito: per il testo (soglia 4,5) AA o AAA, per i componenti (soglia 3) UI. */
export function level(ratio: number, min: 4.5 | 3): Level {
    if (ratio < min) return "Fails";
    if (min === 3) return "UI";
    return ratio >= 7 ? "AAA" : "AA";
}

/** Tronca a un decimale: 4,58 resta 4,5 e non diventa mai 4,6. */
export const truncate1 = (ratio: number) => Math.floor(ratio * 10) / 10;
