import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useI18n } from "../i18n";
import { LandingMockup, MobileAppMockup } from "../previews/Mockups";
import { Icon } from "./Icon";

type View = "landing" | "mobile";
const NATURAL_WIDTH: Record<View, number> = { landing: 880, mobile: 300 };

/**
 * Rimpicciolisce il mockup per farlo stare nello spazio libero (desktop senza scroll, 02 § 1).
 * Con `crop` segue solo la larghezza e taglia il fondo: la finestra della landing riempie il riquadro
 * da bordo a bordo, e sotto c'è solo il resto della settimana.
 */
function Fit({ width, crop = false, children }: { width: number; crop?: boolean; children: ReactNode }) {
    const outer = useRef<HTMLDivElement>(null);
    const inner = useRef<HTMLDivElement>(null);
    const [box, setBox] = useState({ scale: 1, h: 0, max: Infinity });
    useLayoutEffect(() => {
        const stage = outer.current?.closest(".stage");
        if (!stage || !inner.current) return;
        const measure = () => {
            if (!inner.current) return;
            const pad = 4;
            const natH = inner.current.offsetHeight;
            const mobile = window.matchMedia("(max-width: 760px)").matches;
            const scale = Math.min(
                1,
                (stage.clientWidth - pad) / width,
                mobile || crop ? Infinity : (stage.clientHeight - pad) / natH,
            );
            setBox({ scale, h: natH, max: mobile ? Infinity : stage.clientHeight - pad });
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(stage);
        return () => ro.disconnect();
    }, [width, crop]);
    return (
        <div
            ref={outer}
            className="fit"
            style={{ width: width * box.scale, height: Math.min(box.h * box.scale, box.max) }}
        >
            <div ref={inner} style={{ width, transform: `scale(${box.scale})` }} aria-hidden="true">
                {children}
            </div>
        </div>
    );
}

/**
 * Il mockup a grandezza naturale in un dialog nativo. Su desktop il telefono, rimpicciolito per stare
 * nella pagina senza scroll, aveva testi di 5-6 px (revisione visiva 1.0, #12).
 */
function Zoom({ view, onClose }: { view: View | null; onClose: () => void }) {
    const { t } = useI18n();
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const d = ref.current;
        if (!d) return;
        if (view && !d.open) d.showModal?.();
        if (!view && d.open) d.close();
    }, [view]);
    return (
        <dialog ref={ref} className="dialog zoom" aria-labelledby="zoom-title" onClose={onClose}>
            <div className="dialog__head">
                <h2 id="zoom-title">{view ? `${t.preview.title}: ${t.preview[view]}` : t.preview.title}</h2>
                <button className="btn btn--icon" type="button" aria-label={t.dialog.close} onClick={onClose}>
                    <Icon name="x" />
                </button>
            </div>
            {view && (
                <div
                    className="zoom__body"
                    lang="en"
                    aria-hidden="true"
                    style={{ width: NATURAL_WIDTH[view] }}
                >
                    {view === "landing" ? <LandingMockup /> : <MobileAppMockup />}
                </div>
            )}
        </dialog>
    );
}

/** Anteprima con selettore a schede (frecce, Home, End). */
export function Preview() {
    const { t } = useI18n();
    const [view, setView] = useState<View>("landing");
    const [zoom, setZoom] = useState<View | null>(null);
    const tabs: View[] = ["landing", "mobile"];
    const refs = useRef<Record<View, HTMLButtonElement | null>>({ landing: null, mobile: null });

    const onKey = (e: KeyboardEvent, i: number) => {
        const keys: Record<string, number> = {
            ArrowRight: (i + 1) % 2,
            ArrowLeft: (i + 1) % 2,
            Home: 0,
            End: 1,
        };
        const target = keys[e.key];
        if (target === undefined) return;
        e.preventDefault();
        const next = tabs[target] as View;
        setView(next);
        refs.current[next]?.focus();
    };

    return (
        <section className="preview" aria-labelledby="h-prev">
            <div className="side__head">
                <h2 id="h-prev">{t.preview.title}</h2>
                <div className="seg" role="tablist" aria-label={t.preview.title}>
                    {tabs.map((v, i) => (
                        <button
                            key={v}
                            ref={(el) => {
                                refs.current[v] = el;
                            }}
                            role="tab"
                            id={`tab-${v}`}
                            type="button"
                            aria-selected={view === v}
                            aria-controls={`panel-${v}`}
                            tabIndex={view === v ? 0 : -1}
                            onClick={() => setView(v)}
                            onKeyDown={(e) => onKey(e, i)}
                        >
                            {t.preview[v]}
                        </button>
                    ))}
                </div>
                <button
                    className="btn stage__zoom"
                    type="button"
                    aria-haspopup="dialog"
                    aria-label={t.preview.enlargeLabel(t.preview[view])}
                    onClick={() => setZoom(view)}
                >
                    <Icon name="expand" size={16} />
                    {t.preview.enlarge}
                </button>
            </div>
            <div className="stage">
                {tabs.map((v) => (
                    <div
                        key={v}
                        id={`panel-${v}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${v}`}
                        lang="en"
                        hidden={view !== v}
                    >
                        {view === v && (
                            <Fit width={NATURAL_WIDTH[v]} crop={v === "landing"}>
                                {v === "landing" ? <LandingMockup /> : <MobileAppMockup />}
                            </Fit>
                        )}
                    </div>
                ))}
            </div>
            <Zoom view={zoom} onClose={() => setZoom(null)} />
        </section>
    );
}
