import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { truncate1 } from "../color/contrast";
import { en, type Messages } from "./en";
import { it } from "./it";

export type Lang = "en" | "it";
const DICTS: Record<Lang, Messages> = { en, it };
const STORAGE_KEY = "hue-lang";

interface I18n {
    lang: Lang;
    t: Messages;
    /** "4.6:1" in inglese, "4,6:1" in italiano; tronca a un decimale. */
    ratio: (r: number) => string;
    setLang: (lang: Lang) => void;
}

export const formatRatio = (r: number, lang: Lang) =>
    new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(truncate1(r)) +
    ":1";

/** Lingua iniziale (04 § 5b): ?lang= nell'URL, poi la scelta salvata, poi il browser, altrimenti inglese. */
export function detectLang(search: string, languages: readonly string[], stored: string | null): Lang {
    const fromUrl = new URLSearchParams(search).get("lang");
    if (fromUrl === "it" || fromUrl === "en") return fromUrl;
    if (stored === "it" || stored === "en") return stored;
    return languages.some((l) => l.toLowerCase().startsWith("it")) ? "it" : "en";
}

const readStored = () => {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
};

const Ctx = createContext<I18n>({ lang: "en", t: en, ratio: (r) => formatRatio(r, "en"), setLang: () => {} });

export function I18nProvider({ children, initial }: { children: ReactNode; initial?: Lang }) {
    const [lang, setLangState] = useState<Lang>(
        () => initial ?? detectLang(window.location.search, navigator.languages ?? [], readStored()),
    );
    const t = DICTS[lang];

    useEffect(() => {
        document.documentElement.lang = lang;
        document.title = t.meta.title;
        document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
    }, [lang, t]);

    const setLang = useCallback((next: Lang) => {
        setLangState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // senza storage vale la lingua del browser
        }
    }, []);

    const value = useMemo(
        () => ({ lang, t, ratio: (r: number) => formatRatio(r, lang), setLang }),
        [lang, t, setLang],
    );
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
