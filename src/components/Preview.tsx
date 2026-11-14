import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useI18n } from "../i18n";
import { LandingMockup, MobileAppMockup } from "../previews/Mockups";

type View = "landing" | "mobile";
const NATURAL_WIDTH: Record<View, number> = { landing: 720, mobile: 300 };

/** Rimpicciolisce il mockup per farlo stare nello spazio libero (desktop senza scroll, 02 § 1). */
function Fit({ width, children }: { width: number; children: ReactNode }) {
    const outer = useRef<HTMLDivElement>(null);
    const inner = useRef<HTMLDivElement>(null);
    const [box, setBox] = useState({ scale: 1, h: 0 });
    useLayoutEffect(() => {
        const stage = outer.current?.closest(".stage");
        if (!stage || !inner.current) return;
        const measure = () => {
            if (!inner.current) return;
            const pad = 24;
            const natH = inner.current.offsetHeight;
            const mobile = window.matchMedia("(max-width: 760px)").matches;
            const scale = Math.min(
                1,
                (stage.clientWidth - pad) / width,
                mobile ? Infinity : (stage.clientHeight - pad) / natH,
            );
            setBox({ scale, h: natH });
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(stage);
        return () => ro.disconnect();
    }, [width]);
    return (
        <div ref={outer} className="fit" style={{ width: width * box.scale, height: box.h * box.scale }}>
            <div ref={inner} style={{ width, transform: `scale(${box.scale})` }} aria-hidden="true">
                {children}
            </div>
        </div>
    );
}

/** Anteprima con selettore a schede (frecce, Home, End). */
export function Preview() {
    const { t } = useI18n();
    const [view, setView] = useState<View>("landing");
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
            </div>
            <div className="stage">
                {tabs.map((v) => (
                    <div
                        key={v}
                        id={`panel-${v}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${v}`}
                        hidden={view !== v}
                    >
                        {view === v && (
                            <Fit width={NATURAL_WIDTH[v]}>
                                {v === "landing" ? <LandingMockup /> : <MobileAppMockup />}
                            </Fit>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
