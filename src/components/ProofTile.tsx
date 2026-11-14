import type { Check } from "../color/checks";
import type { Hex } from "../color/hex";
import { useI18n } from "../i18n";
import { pairName, verdict } from "../view/model";
import { Icon } from "./Icon";

/**
 * Tessera di prova: solo "Aa" e il rapporto usano i colori della coppia (testo ≥ 24 px);
 * giudizio, sigla e coppia stanno in un'etichetta bianca a 16:1 (critica #3).
 */
export function ProofTile({ check, fg, bg }: { check: Check; fg: Hex; bg: Hex }) {
    const { t, ratio } = useI18n();
    const v = verdict(check, t);
    return (
        <div
            className="proof"
            data-level={check.level}
            style={{ ["--pb" as string]: bg, ["--pf" as string]: fg }}
        >
            <span className="proof__aa" aria-hidden="true">
                Aa
            </span>
            <span className="proof__ratio">{ratio(check.ratio)}</span>
            <span className="proof__meta">
                <span className="proof__verdict">
                    <Icon name={check.level === "Fails" ? "x" : "check"} size={14} />
                    {v.word}
                    <small>{v.code}</small>
                </span>
                <span className="proof__pair">{pairName(check, t)}</span>
            </span>
        </div>
    );
}
