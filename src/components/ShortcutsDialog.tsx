import { useEffect, useRef } from "react";
import { useI18n } from "../i18n";
import { Icon } from "./Icon";

interface Props {
    open: boolean;
    onClose: () => void;
    singleKeys: boolean;
    onSingleKeys: (on: boolean) => void;
}

/** Dialog nativo delle scorciatoie (US21). L'interruttore spegne le scorciatoie a un tasto (WCAG 2.1.4). */
export function ShortcutsDialog({ open, onClose, singleKeys, onSingleKeys }: Props) {
    const { t } = useI18n();
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const d = ref.current;
        if (!d) return;
        if (open && !d.open) d.showModal?.();
        if (!open && d.open) d.close();
    }, [open]);

    const rows: [string[], string][] = [
        [[t.actions.space], t.dialog.generate],
        [[t.dialog.ctrl, "Z"], t.dialog.undo],
        [["L"], t.dialog.lock],
        [["C"], t.dialog.copy],
        [["?"], t.dialog.show],
        [["Esc"], t.dialog.esc],
    ];

    return (
        <dialog ref={ref} className="dialog" aria-labelledby="dlg-title" onClose={onClose}>
            <div className="dialog__head">
                <h2 id="dlg-title">{t.dialog.title}</h2>
                <button className="btn btn--icon" type="button" aria-label={t.dialog.close} onClick={onClose}>
                    <Icon name="x" />
                </button>
            </div>
            <dl className="keys">
                {rows.map(([keys, desc]) => (
                    <div key={desc} style={{ display: "contents" }}>
                        <dt>
                            {keys.map((k, i) => (
                                <span key={k}>
                                    {i > 0 && " + "}
                                    <kbd className="key">{k}</kbd>
                                </span>
                            ))}
                        </dt>
                        <dd>{desc}</dd>
                    </div>
                ))}
            </dl>
            <label className="switch">
                <span>{t.dialog.singleKeys}</span>
                <input
                    type="checkbox"
                    checked={singleKeys}
                    onChange={(e) => onSingleKeys(e.target.checked)}
                />
            </label>
        </dialog>
    );
}
