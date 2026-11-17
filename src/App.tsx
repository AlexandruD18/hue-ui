import { Fragment, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ROLES, type Role } from "./color/generate";
import type { Hex } from "./color/hex";
import { Band } from "./components/Band";
import { ContrastChecks } from "./components/ContrastChecks";
import { Icon } from "./components/Icon";
import { Preview } from "./components/Preview";
import { ShortcutsDialog } from "./components/ShortcutsDialog";
import { useToasts } from "./components/Toasts";
import { useI18n, type Lang } from "./i18n";
import { initialState, reducer, stateFromPalette } from "./state/reducer";
import { readPalette, writeUrl } from "./state/url";
import { buildView, weakest } from "./view/model";

const newSeed = () => Math.floor(Math.random() * 2 ** 32);
const LANGS: Lang[] = ["en", "it"];
const SINGLE_KEYS = "hue-single-keys";

const readSingleKeys = () => {
    try {
        return localStorage.getItem(SINGLE_KEYS) !== "off";
    } catch {
        return true;
    }
};

export function App({ seed = newSeed() }: { seed?: number }) {
    // un link condiviso (?p=) vince sulla palette casuale (US22)
    const [boot] = useState(() => readPalette(window.location.search));
    const [state, dispatch] = useReducer(reducer, seed, (s) =>
        boot.status === "ok" ? stateFromPalette(boot.palette) : initialState(s),
    );
    const { t, lang, setLang } = useI18n();
    const toasts = useToasts();
    const [openWhy, setOpenWhy] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [singleKeys, setSingleKeysState] = useState(readSingleKeys);
    const warned = useRef(false);
    const spaceTaken = useRef(false);
    // true se il focus attuale è arrivato con un clic o un tocco, false se con la tastiera
    const pointerFocus = useRef(false);
    const view = useMemo(() => buildView(state.palette), [state.palette]);
    const canUndo = state.history.length > 0;

    const generate = useCallback(() => {
        setOpenWhy(null);
        dispatch({ type: "generate", seed: newSeed() });
    }, []);
    const undo = useCallback(() => {
        setOpenWhy(null);
        dispatch({ type: "undo" });
    }, []);
    const applyFix = useCallback(
        (role: Role, hex: Hex) => {
            // il pulsante della correzione sparisce col pannello: il focus torna al suo Why?
            const key = openWhy;
            setOpenWhy(null);
            dispatch({ type: "applyFix", role, hex });
            if (key)
                requestAnimationFrame(() =>
                    document.querySelector<HTMLElement>(`[data-why="${key}"]`)?.focus(),
                );
        },
        [openWhy],
    );

    const setSingleKeys = useCallback((on: boolean) => {
        setSingleKeysState(on);
        try {
            localStorage.setItem(SINGLE_KEYS, on ? "on" : "off");
        } catch {
            // senza storage la scelta vale fino alla chiusura della pagina
        }
    }, []);

    // link non valido: si dice perché la palette è nuova (02 § 12)
    useEffect(() => {
        if (boot.status !== "invalid" || warned.current) return;
        warned.current = true;
        toasts.show({ message: t.toast.invalidLink, icon: "alert" });
        // eslint-disable-next-line react-hooks/exhaustive-deps -- solo all'avvio
    }, []);

    // l'URL segue sempre palette e lingua, così il link si copia anche dalla barra degli indirizzi
    useEffect(() => {
        writeUrl(state.palette, lang);
    }, [state.palette, lang]);

    const share = useCallback(async () => {
        writeUrl(state.palette, lang);
        try {
            await navigator.clipboard.writeText(window.location.href);
            toasts.show({ message: t.toast.linkCopied, icon: "link" });
        } catch {
            toasts.show({ message: t.toast.linkFailed, icon: "alert", error: true });
        }
    }, [state.palette, lang, t, toasts]);

    // annunci e toast per ogni evento dello stato
    useEffect(() => {
        const e = state.event;
        if (!e) return;
        if (e.type === "generated") toasts.announce(t.announce.generated);
        if (e.type === "restored") toasts.announce(t.announce.restored);
        if (e.type === "allLocked") toasts.show({ message: t.toast.allLocked, icon: "lock" });
        if (e.type === "lock")
            toasts.announce((e.locked ? t.announce.locked : t.announce.unlocked)(t.roles[e.role]));
        if (e.type === "set") toasts.announce(t.announce.set(t.roles[e.role], e.hex.toUpperCase()));
        if (e.type === "fixed")
            toasts.show({
                message:
                    t.toast.fixApplied(t.roles[e.role], e.hex.toUpperCase()) +
                    (Object.keys(state.adjusted).length > 0 ? " " + t.toast.alsoAdjusted : ""),
                icon: "check",
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps -- reagisce solo al nuovo evento
    }, [state.event]);

    const copy = useCallback(
        async (role: Role, el: HTMLElement | null) => {
            const hex = state.palette[role].toUpperCase();
            try {
                await navigator.clipboard.writeText(hex);
                toasts.show({ message: t.toast.copied(hex), swatch: hex });
            } catch {
                // il codice resta selezionato: si copia a mano con Ctrl+C (02 § 5)
                if (el) {
                    const range = document.createRange();
                    range.selectNodeContents(el);
                    const sel = window.getSelection();
                    sel?.removeAllRanges();
                    sel?.addRange(range);
                }
                toasts.show({ message: t.toast.copyFailed, icon: "alert", error: true });
            }
        },
        [state.palette, t, toasts],
    );

    // tastiera: Space genera (fuori da pulsanti, link, campi), Ctrl+Z annulla, Esc chiude Why?,
    // L e C sulla fascia selezionata, ? apre le scorciatoie. I tasti singoli si spengono (WCAG 2.1.4).
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (e.key === "Escape" && openWhy) {
                const key = openWhy;
                setOpenWhy(null);
                document.querySelector<HTMLElement>(`[data-why="${key}"]`)?.focus();
                return;
            }
            if (target.closest("input, textarea, dialog")) return;
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
                e.preventDefault();
                undo();
                return;
            }
            if (e.ctrlKey || e.metaKey || e.altKey || !singleKeys) return;
            if (e.key === "?") {
                e.preventDefault();
                setDialogOpen(true);
                return;
            }
            const band = target.closest<HTMLElement>("[data-role]");
            const key = e.key.toLowerCase();
            if (band && (key === "l" || key === "c")) {
                const role = band.dataset.role as Role;
                e.preventDefault();
                if (key === "l") dispatch({ type: "toggleLock", role });
                else void copy(role, band.querySelector<HTMLElement>(".band__hex"));
                return;
            }
            // dopo un clic il focus resta sul pulsante senza che l'utente lo sappia: lì Spazio genera, come dice
            // il suggerimento. Se al pulsante si è arrivati con la tastiera, Spazio lo preme, come ci si aspetta.
            const control = target.closest("button, a, [role=tab], [role=tabpanel]");
            if (e.code === "Space" && (!control || (control.matches("button") && pointerFocus.current))) {
                e.preventDefault();
                spaceTaken.current = true;
                generate();
            }
        };
        // il pulsante si preme al rilascio di Spazio: se Spazio ha già generato, il rilascio non conta.
        // Il segno sta in un ref perché generare ricrea questo effetto tra la pressione e il rilascio.
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.code !== "Space" || !spaceTaken.current) return;
            spaceTaken.current = false;
            e.preventDefault();
        };
        const onPointer = () => (pointerFocus.current = true);
        const onNavKey = (e: KeyboardEvent) => {
            if (e.key === "Tab" || e.key.startsWith("Arrow")) pointerFocus.current = false;
        };
        document.addEventListener("pointerdown", onPointer, true);
        document.addEventListener("keydown", onNavKey, true);
        document.addEventListener("keydown", onKey);
        document.addEventListener("keyup", onKeyUp);
        return () => {
            document.removeEventListener("pointerdown", onPointer, true);
            document.removeEventListener("keydown", onNavKey, true);
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("keyup", onKeyUp);
        };
    }, [generate, undo, copy, openWhy, singleKeys]);

    // un clic fuori dal pannello Why? lo chiude
    useEffect(() => {
        if (!openWhy) return;
        const onClick = (e: MouseEvent) => {
            const el = e.target as HTMLElement;
            if (!el.closest(".whypanel, [data-why]")) setOpenWhy(null);
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, [openWhy]);

    const toggleWhy = (key: string) => setOpenWhy((cur) => (cur === key ? null : key));

    const undoButton = (tipId: string) => (
        <button
            className="btn"
            type="button"
            aria-disabled={!canUndo}
            aria-describedby={canUndo ? undefined : tipId}
            aria-keyshortcuts="Control+Z"
            onClick={() => canUndo && undo()}
        >
            <Icon name="undo" />
            {t.actions.undo}
            {/* fuori dal nome accessibile: arriva come descrizione solo quando non c'è niente da annullare */}
            {!canUndo && (
                <span className="tip" id={tipId} role="tooltip" aria-hidden="true">
                    {t.actions.nothingToUndo}
                </span>
            )}
        </button>
    );

    const shareButton = () => (
        <button className="btn" type="button" aria-label={t.actions.shareLabel} onClick={() => void share()}>
            <Icon name="link" />
            {t.actions.share}
        </button>
    );

    return (
        <div className="app" style={view.vars}>
            <header className="top">
                <h1 className="mark">Hue UI</h1>
                <p className="tagline">{t.tagline}</p>
                <nav className="langs" aria-label={t.credits.language}>
                    {LANGS.map((l, i) => (
                        <Fragment key={l}>
                            {/* il punto resta fuori dal nome del pulsante */}
                            {i > 0 && (
                                <span className="langs__sep" aria-hidden="true">
                                    ·
                                </span>
                            )}
                            <button
                                type="button"
                                lang={l}
                                aria-current={lang === l ? "true" : undefined}
                                onClick={() => setLang(l)}
                            >
                                {t.languages[l]}
                            </button>
                        </Fragment>
                    ))}
                </nav>
                <div className="top__actions">
                    <button
                        className="btn"
                        type="button"
                        aria-haspopup="dialog"
                        aria-keyshortcuts={singleKeys ? "?" : undefined}
                        onClick={() => setDialogOpen(true)}
                    >
                        <Icon name="keyboard" />
                        {t.actions.shortcuts}
                    </button>
                    {shareButton()}
                </div>
            </header>

            <div className="layout">
                <main className="palette">
                    <h2 className="sr-only">{t.palette}</h2>
                    <ul className="bands" aria-label={t.palette}>
                        {ROLES.map((role, i) => (
                            <Band
                                key={role}
                                role={role}
                                index={i}
                                palette={state.palette}
                                derived={view.derived}
                                locks={state.locks}
                                check={weakest(role, view.list)}
                                adjustment={state.adjusted[role]}
                                whyOpen={openWhy === `band:${role}`}
                                onToggleWhy={() => toggleWhy(`band:${role}`)}
                                onToggleLock={() => dispatch({ type: "toggleLock", role })}
                                onSetColor={(hex) => dispatch({ type: "setColor", role, hex })}
                                onApplyFix={applyFix}
                                onCopy={copy}
                            />
                        ))}
                    </ul>
                    <div className="actions">
                        <button
                            className="btn btn--primary"
                            type="button"
                            aria-keyshortcuts={singleKeys ? "Space" : undefined}
                            onClick={generate}
                        >
                            <Icon name="refresh" />
                            {t.actions.generate}
                        </button>
                        {undoButton("tip-undo")}
                        {singleKeys && (
                            <span className="hint hint--space">
                                {t.actions.orPress} <kbd className="key">{t.actions.space}</kbd>
                            </span>
                        )}
                    </div>
                </main>

                <aside className="side">
                    <ContrastChecks
                        list={view.list}
                        palette={state.palette}
                        derived={view.derived}
                        locks={state.locks}
                        openWhy={openWhy}
                        onToggleWhy={toggleWhy}
                        onApplyFix={applyFix}
                    />
                    <Preview />
                    <footer className="credits">
                        <span>{t.credits.author}</span>
                        <a href="https://github.com/AlexandruD18/hue-ui">{t.credits.code}</a>
                        <span>{t.credits.formula}</span>
                    </footer>
                </aside>
            </div>

            <div className="dock">
                {undoButton("tip-undo-m")}
                <button className="btn btn--primary" type="button" onClick={generate}>
                    <Icon name="refresh" />
                    {t.actions.generate}
                </button>
                {shareButton()}
            </div>

            <ShortcutsDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                singleKeys={singleKeys}
                onSingleKeys={setSingleKeys}
            />
        </div>
    );
}
