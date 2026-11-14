import { ROLES, type Palette } from "../color/generate";
import type { Hex } from "../color/hex";
import type { Lang } from "../i18n";

// ?p=f7f4ee-ece6dc-1c1b1a-3e5bd0-c2410c, nell'ordine background, surface, text, primary, accent (04 § 3)
const PALETTE = /^[0-9a-f]{6}(-[0-9a-f]{6}){4}$/;

export const encodePalette = (p: Palette) => ROLES.map((r) => p[r].slice(1)).join("-");

/** Legge il parametro `p`: null se manca o non è valido. Validazione stretta, mai HTML (04 § 7). */
export function decodePalette(value: string | null): Palette | null {
    if (!value) return null;
    const v = value.trim().toLowerCase();
    if (!PALETTE.test(v)) return null;
    const parts = v.split("-");
    return Object.fromEntries(ROLES.map((r, i) => [r, `#${parts[i]}` as Hex])) as Palette;
}

export type UrlPalette = { status: "none" } | { status: "invalid" } | { status: "ok"; palette: Palette };

export function readPalette(search: string): UrlPalette {
    const raw = new URLSearchParams(search).get("p");
    if (raw === null) return { status: "none" };
    const palette = decodePalette(raw);
    return palette ? { status: "ok", palette } : { status: "invalid" };
}

/** Scrive palette e lingua nell'URL senza riempire la cronologia del browser. */
export function writeUrl(p: Palette, lang: Lang) {
    const url = new URL(window.location.href);
    url.searchParams.set("p", encodePalette(p));
    url.searchParams.set("lang", lang);
    window.history.replaceState(null, "", url);
}
