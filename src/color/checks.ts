import type { Hex } from "./hex";
import { contrast, level, type Level } from "./contrast";
import type { Derived } from "./derive";
import type { Palette, Role } from "./generate";

export type CheckId =
    | "text-bg"
    | "text-surface"
    | "muted-bg"
    | "on-primary"
    | "primary-bg"
    | "accent-bg"
    | "status-bg"
    | "status-surface";

/** Chi sta in primo piano: un ruolo scelto o un ruolo ricavato. */
export type Member = Role | keyof Derived;

export interface Check {
    id: CheckId;
    fg: Member;
    bg: Role;
    ratio: number;
    min: 4.5 | 3;
    level: Level;
}

const STATUS = ["success", "warning", "error"] as const;

/** Le 8 coppie verificate (02 § 4). Per gli stati vale il peggiore dei tre colori. */
export function checks(p: Palette, d: Derived): Check[] {
    const color = (m: Member): Hex => (m in p ? p[m as Role] : d[m as keyof Derived]);
    const worst = (bg: Role) =>
        STATUS.map((s) => [s, contrast(d[s], p[bg])] as const).reduce((a, b) => (b[1] < a[1] ? b : a))[0];
    const rows: [CheckId, Member, Role, 4.5 | 3][] = [
        ["text-bg", "text", "background", 4.5],
        ["text-surface", "text", "surface", 4.5],
        ["muted-bg", "mutedText", "background", 4.5],
        ["on-primary", "onPrimary", "primary", 4.5],
        ["primary-bg", "primary", "background", 3],
        ["accent-bg", "accent", "background", 3],
        ["status-bg", worst("background"), "background", 3],
        ["status-surface", worst("surface"), "surface", 3],
    ];
    return rows.map(([id, fg, bg, min]) => {
        const ratio = contrast(color(fg), p[bg]);
        return { id, fg, bg, ratio, min, level: level(ratio, min) };
    });
}
