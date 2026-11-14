import { hexToRgb, rgbToHex, type Hex } from "./hex";

/** Colore OKLCH: l 0-1, c ≥ 0, h in gradi 0-360. */
export interface Oklch {
    l: number;
    c: number;
    h: number;
}

const toLinear = (v: number) => {
    const x = v / 255;
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};
const fromLinear = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255;

// Matrici di Björn Ottosson (OKLab, 2020)
function linearToOklab(r: number, g: number, b: number): [number, number, number] {
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
        0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    ];
}

function oklabToLinear(L: number, a: number, b: number): [number, number, number] {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
}

export function hexToOklch(hex: Hex): Oklch {
    const [r, g, b] = hexToRgb(hex).map(toLinear) as [number, number, number];
    const [L, a, bb] = linearToOklab(r, g, b);
    const c = Math.hypot(a, bb);
    const h = c < 1e-7 ? 0 : (Math.atan2(bb, a) * 180) / Math.PI;
    return { l: L, c, h: (h + 360) % 360 };
}

function oklchToLinear({ l, c, h }: Oklch): [number, number, number] {
    const rad = (h * Math.PI) / 180;
    return oklabToLinear(l, c * Math.cos(rad), c * Math.sin(rad));
}

const EPS = 1e-6;
const inGamut = (rgb: readonly number[]) => rgb.every((v) => v >= -EPS && v <= 1 + EPS);

/**
 * OKLCH → "#rrggbb". Se il colore esce dal gamut sRGB riduce solo la croma (bisezione),
 * così luminosità e tinta restano quelle chieste.
 */
export function oklchToHex(color: Oklch): Hex {
    const l = Math.min(1, Math.max(0, color.l));
    let lin = oklchToLinear({ ...color, l });
    if (!inGamut(lin)) {
        let lo = 0;
        let hi = color.c;
        for (let i = 0; i < 24; i++) {
            const mid = (lo + hi) / 2;
            if (inGamut(oklchToLinear({ l, c: mid, h: color.h }))) lo = mid;
            else hi = mid;
        }
        lin = oklchToLinear({ l, c: lo, h: color.h });
    }
    return rgbToHex(lin.map((v) => fromLinear(Math.min(1, Math.max(0, v)))) as [number, number, number]);
}

/** Mescola due colori in OKLCH (tinta sull'arco più corto). */
export function mixOklch(a: Oklch, b: Oklch, t: number): Oklch {
    let dh = b.h - a.h;
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360;
    const h = a.c < 0.01 ? b.h : b.c < 0.01 ? a.h : a.h + dh * t;
    return { l: a.l + (b.l - a.l) * t, c: a.c + (b.c - a.c) * t, h: (h + 360) % 360 };
}
