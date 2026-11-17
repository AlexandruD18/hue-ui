import { useEffect, useRef, useState } from "react";
import type { Check } from "../color/checks";
import type { Derived } from "../color/derive";
import type { Adjustment, Locks, Palette, Role } from "../color/generate";
import { parseHex, type Hex } from "../color/hex";
import { useI18n } from "../i18n";
import { colorOf, labelOn, memberName, pairName, verdict } from "../view/model";
import { Icon } from "./Icon";
import { ProofTile } from "./ProofTile";
import { WhyPanel } from "./WhyPanel";

interface Props {
    role: Role;
    index: number;
    palette: Palette;
    derived: Derived;
    locks: Locks;
    check: Check;
    adjustment?: Adjustment;
    whyOpen: boolean;
    onToggleWhy: () => void;
    onToggleLock: () => void;
    onSetColor: (hex: Hex) => void;
    onApplyFix: (role: Role, hex: Hex) => void;
    onCopy: (role: Role, el: HTMLElement | null) => void;
}

/** Una fascia per ruolo (02 § 2). Le etichette sono in nero o bianco, mai nei colori della coppia. */
export function Band(props: Props) {
    const { role, index, palette, derived, locks, check, adjustment, whyOpen } = props;
    const { t, ratio } = useI18n();
    const [editing, setEditing] = useState(false);
    const [preview, setPreview] = useState<Hex | null>(null);
    const hexRef = useRef<HTMLSpanElement>(null);
    const editRef = useRef<HTMLButtonElement>(null);
    const name = t.roles[role];
    const hex = palette[role];
    const H = hex.toUpperCase();
    const v = verdict(check, t);
    const bandColor = preview ?? hex;
    const panelId = `why-${role}`;

    return (
        <li
            className={"band" + (whyOpen ? " is-open" : "") + (editing ? " is-editing" : "")}
            data-role={role}
            style={{ ["--c" as string]: bandColor, ["--on" as string]: labelOn(bandColor) }}
        >
            {editing ? (
                <HexEditor
                    role={role}
                    initial={H}
                    onPreview={setPreview}
                    onDone={(value) => {
                        setPreview(null);
                        setEditing(false);
                        if (value) props.onSetColor(value);
                        editRef.current?.focus();
                    }}
                />
            ) : (
                <div className="band__who">
                    <p className="band__role">{name}</p>
                    <button
                        className="band__hex"
                        type="button"
                        aria-label={t.band.copy(name, H)}
                        onClick={() => props.onCopy(role, hexRef.current)}
                    >
                        <span ref={hexRef}>{H}</span>
                        <Icon name="copy" size={16} />
                    </button>
                    <span className="band__grade" data-level={check.level}>
                        <Icon name={check.level === "Fails" ? "x" : "check"} size={14} />
                        <b>{ratio(check.ratio)}</b> {v.word}
                        {/* su mobile la tessera non c'è: il chip dice da solo quale coppia misura */}
                        <span className="band__gradepair">
                            {t.against(memberName(check.fg === role ? check.bg : check.fg, t))}
                        </span>
                    </span>
                    {(locks[role] || adjustment) && (
                        <span className="band__note">
                            <Icon name={locks[role] ? "lock" : "adjust"} size={14} />
                            {locks[role] ? t.band.locked : t.band.adjusted}
                        </span>
                    )}
                </div>
            )}
            <ProofTile
                check={check}
                fg={colorOf(check.fg, palette, derived)}
                bg={colorOf(check.bg, palette, derived)}
            />
            <div className="ctrl">
                <button
                    ref={editRef}
                    className="ib"
                    type="button"
                    title={t.band.editTip}
                    aria-label={t.band.edit(name, H)}
                    onClick={() => setEditing(true)}
                >
                    <Icon name="pencil" />
                </button>
                <button
                    className="ib"
                    type="button"
                    title={locks[role] ? t.band.unlockTip : t.band.lockTip}
                    aria-label={t.band.lock(name)}
                    aria-pressed={locks[role]}
                    data-lock={role}
                    onClick={props.onToggleLock}
                >
                    <Icon name={locks[role] ? "lock" : "unlock"} />
                </button>
                <button
                    className="why"
                    type="button"
                    data-why={`band:${role}`}
                    aria-expanded={whyOpen}
                    aria-controls={whyOpen ? panelId : undefined}
                    aria-label={t.band.whyLabel(name, pairName(check, t), ratio(check.ratio))}
                    onClick={props.onToggleWhy}
                >
                    {t.band.why}
                </button>
            </div>
            {whyOpen && (
                <WhyPanel
                    id={panelId}
                    check={check}
                    palette={palette}
                    derived={derived}
                    locks={locks}
                    adjusted={adjustment && !locks[role] ? { role, adj: adjustment } : undefined}
                    up={index >= 3}
                    onApplyFix={props.onApplyFix}
                />
            )}
        </li>
    );
}

/** Campo per scrivere un colore (02 § 12): anteprima mentre si scrive, Invio o clic fuori applicano, Esc annulla. */
function HexEditor({
    role,
    initial,
    onPreview,
    onDone,
}: {
    role: Role;
    initial: string;
    onPreview: (hex: Hex | null) => void;
    onDone: (value: Hex | null) => void;
}) {
    const { t } = useI18n();
    const [value, setValue] = useState(initial);
    const [invalid, setInvalid] = useState(false);
    const input = useRef<HTMLInputElement>(null);
    const finished = useRef(false);
    const id = `hex-${role}`;

    useEffect(() => {
        input.current?.focus();
        input.current?.select();
    }, []);

    const finish = (result: Hex | null) => {
        if (finished.current) return;
        finished.current = true;
        onDone(result);
    };

    return (
        <div className="hexedit">
            <label className="hexedit__label" htmlFor={id}>
                {t.hex.label(t.roles[role])}
            </label>
            <input
                ref={input}
                id={id}
                value={value}
                spellCheck={false}
                autoComplete="off"
                aria-invalid={invalid || undefined}
                aria-describedby={`${id}-msg`}
                onChange={(e) => {
                    setValue(e.target.value);
                    setInvalid(false);
                    onPreview(parseHex(e.target.value));
                }}
                onKeyDown={(e) => {
                    // preventDefault: il focus torna al pulsante Modifica mentre il tasto è premuto;
                    // senza, il browser "clicca" quel pulsante e il campo si riapre
                    if (e.key === "Escape") {
                        e.preventDefault();
                        e.stopPropagation();
                        finish(null);
                    }
                    if (e.key === "Enter") {
                        e.preventDefault();
                        const h = parseHex(value);
                        if (h) finish(h);
                        else setInvalid(true);
                    }
                }}
                onBlur={() => finish(parseHex(value))}
            />
            {invalid ? (
                <span className="hexedit__msg hexedit__msg--error" id={`${id}-msg`} role="alert">
                    <Icon name="x" size={15} />
                    {t.hex.error}
                </span>
            ) : (
                <span className="hexedit__msg" id={`${id}-msg`}>
                    {t.hex.hint}
                </span>
            )}
        </div>
    );
}
