import type { Hex } from "./hex";
import { contrast } from "./contrast";
import { hexToOklch } from "./oklch";
import { fitLightness } from "./fit";
import type { Check } from "./checks";
import type { Derived } from "./derive";
import { ROLES, type Palette, type Role } from "./generate";

export interface Fix {
    role: Role;
    hex: Hex;
    ratio: number;
    direction: "darken" | "lighten";
}

const isRole = (m: string): m is Role => (ROLES as readonly string[]).includes(m);

/**
 * Correzione per una coppia che non passa: stessa tinta, luminosità diversa (02 § 7).
 * Cambia il primo piano se è un ruolo scelto diverso da Background, altrimenti lo sfondo.
 */
export function suggestFix(check: Check, p: Palette, d: Derived): Fix {
    const role: Role = isRole(check.fg) && check.fg !== "background" ? check.fg : check.bg;
    const other: Hex =
        role === check.fg ? p[check.bg] : isRole(check.fg) ? p[check.fg] : d[check.fg as keyof Derived];
    const original = hexToOklch(p[role]);
    const hex = fitLightness(original, [other], check.min) ?? p[role];
    return {
        role,
        hex,
        ratio: contrast(hex, other),
        direction: hexToOklch(hex).l < original.l ? "darken" : "lighten",
    };
}
