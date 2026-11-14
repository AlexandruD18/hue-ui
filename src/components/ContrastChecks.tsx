import type { Check } from "../color/checks";
import type { Derived } from "../color/derive";
import type { Locks, Palette, Role } from "../color/generate";
import type { Hex } from "../color/hex";
import { useI18n } from "../i18n";
import { colorOf, pairName, verdict } from "../view/model";
import { Icon } from "./Icon";
import { WhyPanel } from "./WhyPanel";

interface Props {
    list: Check[];
    palette: Palette;
    derived: Derived;
    locks: Locks;
    openWhy: string | null;
    onToggleWhy: (key: string) => void;
    onApplyFix: (role: Role, hex: Hex) => void;
}

const x = (r: number) => Math.min(Math.log(r) / Math.log(21), 1) * 100;
const TICKS: [number, string][] = [
    [1, "1:1"],
    [3, "3 UI"],
    [4.5, "4.5 AA"],
    [7, "7 AAA"],
    [21, "21:1"],
];
const ZONES: [string, number, number][] = [
    ["fail", 1, 3],
    ["ui", 3, 4.5],
    ["aa", 4.5, 7],
    ["aaa", 7, 21],
];

/** Righello del contrasto (scala logaritmica 1:1-21:1): un punto per coppia, disegnato con i suoi due colori. */
function Ruler({ list, palette, derived }: Pick<Props, "list" | "palette" | "derived">) {
    const { ratio } = useI18n();
    const placed: { x: number; row: number }[] = [];
    const dots = [...list]
        .sort((a, b) => a.ratio - b.ratio)
        .map((c) => {
            const px = x(c.ratio);
            let row = 0;
            while (placed.some((p) => p.row === row && Math.abs(p.x - px) < 2.6)) row++;
            placed.push({ x: px, row });
            return { c, px, row };
        });
    return (
        // i punti impilati oltre la seconda riga salgono sopra la barra: il margine fa loro posto
        <div
            className="ruler__bar"
            aria-hidden="true"
            style={{ marginTop: Math.max(0, Math.max(0, ...dots.map((d) => d.row)) - 2) * 14 }}
        >
            <div className="ruler__track">
                {ZONES.map(([k, a, b]) => (
                    <span
                        key={k}
                        className={`ruler__zone ruler__zone--${k}`}
                        style={{ width: `${x(b) - x(a)}%` }}
                    />
                ))}
            </div>
            {TICKS.map(([r, label]) => {
                const [n, ...rest] = label.split(" ");
                return (
                    <span
                        key={r}
                        className="ruler__tick"
                        style={{
                            left: `${x(r)}%`,
                            transform: r === 1 ? "none" : r === 21 ? "translateX(-100%)" : undefined,
                        }}
                    >
                        {rest.length ? (
                            <>
                                <b>
                                    {ratio(Number(n))
                                        .replace(":1", "")
                                        .replace(/[.,]0$/, "")}
                                </b>{" "}
                                {rest.join(" ")}
                            </>
                        ) : (
                            label
                        )}
                    </span>
                );
            })}
            {dots.map(({ c, px, row }) => (
                <span
                    key={c.id}
                    className="ruler__dot"
                    data-level={c.level}
                    style={{
                        left: `${px}%`,
                        top: `${28 - row * 14}px`,
                        ["--db" as string]: colorOf(c.bg, palette, derived),
                        ["--df" as string]: colorOf(c.fg, palette, derived),
                    }}
                />
            ))}
        </div>
    );
}

/** Controllo dei contrasti (02 § 4): sintesi, spiegazione dei numeri, righello, 8 coppie. */
export function ContrastChecks(props: Props) {
    const { list, palette, derived, locks, openWhy, onToggleWhy, onApplyFix } = props;
    const { t, ratio } = useI18n();
    const fails = list.filter((c) => c.level === "Fails").length;
    const help = t.checks.help;
    return (
        <section className="ruler" aria-labelledby="h-checks">
            <div className="side__head">
                <h2 id="h-checks">{t.checks.title}</h2>
                <p className="ruler__sum" data-level={fails ? "Fails" : "ok"}>
                    <Icon name={fails ? "x" : "check"} size={16} />
                    {fails ? t.checks.someFail(fails, list.length) : t.checks.allPass(list.length)}
                </p>
            </div>
            <p className="ruler__help">{help.map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part))}</p>
            <Ruler list={list} palette={palette} derived={derived} />
            <ul className="checks">
                {list.map((c, i) => {
                    const key = `check:${c.id}`;
                    const open = openWhy === key;
                    const v = verdict(c, t);
                    const label = c.id.startsWith("status")
                        ? t.pair(t.roles.status, t.roles[c.bg])
                        : pairName(c, t);
                    return (
                        <li key={c.id} data-level={c.level}>
                            <button
                                className="check"
                                type="button"
                                data-why={key}
                                aria-expanded={open}
                                aria-controls={open ? `why-${c.id}` : undefined}
                                onClick={() => onToggleWhy(key)}
                            >
                                <span>{label}</span>
                                <span className="check__ratio">{ratio(c.ratio)}</span>
                                <span className="lv" data-level={c.level}>
                                    <Icon name={c.level === "Fails" ? "x" : "check"} size={14} />
                                    {c.level === "Fails" ? t.verdict.Fails : c.level}
                                </span>
                                {/* nome accessibile = testo visibile + giudizio (WCAG 2.5.3) */}
                                <span className="sr-only">{t.checks.rowExtra(v.word)}</span>
                            </button>
                            {open && (
                                <WhyPanel
                                    id={`why-${c.id}`}
                                    check={c}
                                    palette={palette}
                                    derived={derived}
                                    locks={locks}
                                    right={i % 2 === 1}
                                    onApplyFix={onApplyFix}
                                />
                            )}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
