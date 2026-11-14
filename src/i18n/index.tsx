import { createContext, useContext, type ReactNode } from "react";
import { truncate1 } from "../color/contrast";
import { en, type Messages } from "./en";

export type Lang = "en" | "it";

interface I18n {
    lang: Lang;
    t: Messages;
    /** "4.6:1" in inglese, "4,6:1" in italiano; tronca a un decimale. */
    ratio: (r: number) => string;
}

export const formatRatio = (r: number, lang: Lang) =>
    new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(truncate1(r)) +
    ":1";

const Ctx = createContext<I18n>({ lang: "en", t: en, ratio: (r) => formatRatio(r, "en") });

export function I18nProvider({ children }: { children: ReactNode }) {
    const lang: Lang = "en";
    return (
        <Ctx.Provider value={{ lang, t: en, ratio: (r) => formatRatio(r, lang) }}>{children}</Ctx.Provider>
    );
}

export const useI18n = () => useContext(Ctx);
