import type { Check } from "../color/checks";
import { contrast } from "../color/contrast";
import type { Derived } from "../color/derive";
import { suggestFix } from "../color/fix";
import { ROLES, type Adjustment, type Locks, type Palette, type Role } from "../color/generate";
import { hexToOklch } from "../color/oklch";
import { useI18n } from "../i18n";
import { memberName, pairName } from "../view/model";

interface Props {
    id: string;
    check: Check;
    palette: Palette;
    derived: Derived;
    locks: Locks;
    /** correzione del generatore sul ruolo della fascia, se c'è */
    adjusted?: { role: Role; adj: Adjustment };
    up?: boolean;
    right?: boolean;
    onApplyFix: (role: Role, hex: `#${string}`) => void;
}

const isRole = (m: string): m is Role => (ROLES as readonly string[]).includes(m);

/** Pannello Why? non modale (02 § 7): cosa misura, se va bene, cosa fare. */
export function WhyPanel({ id, check, palette, derived, locks, adjusted, up, right, onApplyFix }: Props) {
    const { t, ratio } = useI18n();
    const cls =
        "whypanel" +
        (check.level === "Fails" ? " whypanel--fail" : "") +
        (up ? " whypanel--up" : "") +
        (right ? " whypanel--right" : "");

    if (adjusted && check.level !== "Fails") {
        const { role, adj } = adjusted;
        const dir = hexToOklch(adj.to).l < hexToOklch(adj.from).l ? t.why.darkened : t.why.lightened;
        const reach =
            role === "primary" && check.id === "on-primary"
                ? t.why.reachButtons(
                      derived.onPrimary === "#ffffff" ? t.why.whiteText : t.why.textWord,
                      ratio(check.ratio),
                  )
                : t.why.reachPair(pairName(check, t), ratio(check.ratio));
        const title = t.why.adjustedTitle(t.roles[role]);
        return (
            <div className={cls} id={id} role="region" aria-label={t.band.why + " " + title}>
                <p className="whypanel__title">
                    <span>{title}</span>
                </p>
                <p>{t.why.adjusted(dir, adj.from.toUpperCase(), adj.to.toUpperCase(), reach)}</p>
                <div className="whypanel__pair">
                    <span className="whypanel__sw" style={{ background: adj.from }} />
                    <span className="num">{adj.from.toUpperCase()}</span>
                    <span>{t.why.to}</span>
                    <span className="whypanel__sw" style={{ background: adj.to }} />
                    <span className="num">{adj.to.toUpperCase()}</span>
                </div>
            </div>
        );
    }

    const title = pairName(check, t);
    let body: string;
    let fix: { role: Role; hex: `#${string}`; text: string } | null = null;
    if (check.level === "Fails") {
        const named = (m: string) =>
            isRole(m) && locks[m] ? t.why.locked(memberName(m as Role, t)) : memberName(m as Role, t);
        const first = named(check.bg);
        body =
            t.why.tooClose(
                first.charAt(0).toUpperCase() + first.slice(1),
                named(check.fg),
                ratio(check.ratio),
            ) +
            " " +
            (check.min === 4.5 ? t.why.needText : t.why.needUi);
        const f = suggestFix(check, palette, derived);
        const other =
            f.role === check.fg
                ? palette[check.bg]
                : isRole(check.fg)
                  ? palette[check.fg]
                  : derived[check.fg as keyof Derived];
        fix = {
            role: f.role,
            hex: f.hex,
            text: t.why.fixLine(
                f.direction,
                t.roles[f.role],
                f.hex.toUpperCase(),
                ratio(contrast(f.hex, other)),
            ),
        };
    } else if (check.min === 3) body = t.why.ui;
    else body = check.level === "AAA" ? t.why.aaa : t.why.aa;

    return (
        <div className={cls} id={id} role="region" aria-label={t.band.why + " " + title}>
            <p className="whypanel__title">
                <span>{title}</span>
                <span className="num">{ratio(check.ratio)}</span>
            </p>
            <p>{body}</p>
            {fix && (
                <div className="whypanel__fix">
                    <span>
                        <b>{t.why.fix}</b>
                        {fix.text}
                    </span>
                    <button
                        className="btn btn--danger"
                        type="button"
                        onClick={() => onApplyFix(fix.role, fix.hex)}
                    >
                        {t.why.applyFix}
                    </button>
                </div>
            )}
        </div>
    );
}
