import { checks, type Check, type Member } from "../color/checks";
import { contrast } from "../color/contrast";
import { derive, type Derived } from "../color/derive";
import type { Palette, Role } from "../color/generate";
import type { Hex } from "../color/hex";
import type { Messages } from "../i18n/en";

export interface View {
    derived: Derived;
    list: Check[];
    /** valori di tutte le variabili --p-* dei ruoli */
    vars: Record<string, Hex>;
}

export function buildView(p: Palette): View {
    const derived = derive(p);
    return {
        derived,
        list: checks(p, derived),
        vars: {
            "--p-background": p.background,
            "--p-surface": p.surface,
            "--p-text": p.text,
            "--p-primary": p.primary,
            "--p-accent": p.accent,
            "--p-muted-text": derived.mutedText,
            "--p-on-primary": derived.onPrimary,
            "--p-border": derived.border,
            "--p-success": derived.success,
            "--p-warning": derived.warning,
            "--p-error": derived.error,
        },
    };
}

/** Colore di un membro della coppia (ruolo scelto o ricavato). */
export const colorOf = (m: Member, p: Palette, d: Derived): Hex =>
    m in p ? p[m as Role] : d[m as keyof Derived];

// Coppie che contengono il ruolo (02 § 2): per Text solo quelle in cui Text è il primo piano
const PAIRS_OF: Record<Role, (c: Check) => boolean> = {
    background: (c) => c.bg === "background",
    surface: (c) => c.bg === "surface",
    text: (c) => c.fg === "text",
    primary: (c) => c.fg === "primary" || c.bg === "primary",
    accent: (c) => c.fg === "accent",
};

/** La coppia più debole del ruolo, relativa alla sua soglia. */
export function weakest(role: Role, list: Check[]): Check {
    const mine = list.filter(PAIRS_OF[role]);
    return mine.reduce((a, b) => (b.ratio / b.min < a.ratio / a.min ? b : a));
}

/** Etichette della fascia sempre leggibili: nero o bianco, quello con più contrasto (minimo 4,58:1). */
export const labelOn = (bg: Hex): Hex =>
    contrast("#ffffff", bg) >= contrast("#000000", bg) ? "#ffffff" : "#000000";

/** Giudizio a parole e sigla (02 § 2). */
export function verdict(c: Check, t: Messages): { word: string; code: string } {
    if (c.level === "Fails")
        return { word: c.min === 4.5 ? t.verdict.failsText : t.verdict.failsUi, code: t.verdict.Fails };
    return { word: t.verdict[c.level], code: c.level };
}

/** Nome leggibile di un membro della coppia. */
export function memberName(m: Member, t: Messages): string {
    if (m === "success" || m === "warning" || m === "error") return t.roles.statusColors;
    return t.roles[m];
}

export const pairName = (c: Check, t: Messages) => t.pair(memberName(c.fg, t), memberName(c.bg, t));
