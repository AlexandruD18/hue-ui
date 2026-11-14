/** Codice colore normalizzato: "#rrggbb" minuscolo. */
export type Hex = `#${string}`;

const SHORT = /^[0-9a-f]{3}$/i;
const LONG = /^[0-9a-f]{6}$/i;

/** Legge #RGB, #RRGGBB, RGB o RRGGBB (maiuscole e spazi ammessi). Restituisce null se non è un colore. */
export function parseHex(input: string): Hex | null {
    let v = input.trim().replace(/^#/, "");
    if (SHORT.test(v)) v = [...v].map((c) => c + c).join("");
    return LONG.test(v) ? (`#${v.toLowerCase()}` as Hex) : null;
}

/** Canali sRGB 0-255. */
export function hexToRgb(hex: Hex): [number, number, number] {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: readonly [number, number, number]): Hex {
    const to = (v: number) =>
        Math.round(Math.min(255, Math.max(0, v)))
            .toString(16)
            .padStart(2, "0");
    return `#${to(r)}${to(g)}${to(b)}` as Hex;
}
