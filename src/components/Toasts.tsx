import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { useI18n } from "../i18n";

interface ToastData {
    id: number;
    message: string;
    icon?: IconName;
    swatch?: string;
    error?: boolean;
}

interface ToastApi {
    show: (t: Omit<ToastData, "id">) => void;
    announce: (message: string) => void;
}

const Ctx = createContext<ToastApi>({ show: () => {}, announce: () => {} });
export const useToasts = () => useContext(Ctx);

/**
 * Toast in basso al centro con una sola regione aria-live (critica #19), più una regione
 * nascosta per gli annunci ai lettori di schermo. I toast informativi spariscono dopo 4 s;
 * quello di errore contiene un'istruzione e resta finché non si chiude (critica #16).
 * Errore e informazione hanno due posti diversi: un messaggio nuovo non cancella l'istruzione
 * di un errore ancora aperto (revisione visiva 1.0, #10).
 */
export function ToastProvider({ children }: { children: ReactNode }) {
    const { t } = useI18n();
    const [info, setInfo] = useState<ToastData | null>(null);
    const [error, setError] = useState<ToastData | null>(null);
    const [message, setMessage] = useState("");
    const timer = useRef<number | undefined>(undefined);
    const n = useRef(0);

    const show = useCallback((data: Omit<ToastData, "id">) => {
        const toast = { ...data, id: ++n.current };
        if (data.error) {
            setError(toast);
            return;
        }
        window.clearTimeout(timer.current);
        setInfo(toast);
        timer.current = window.setTimeout(() => setInfo(null), 4000);
    }, []);

    const announce = useCallback((msg: string) => {
        setMessage("");
        window.setTimeout(() => setMessage(msg), 30);
    }, []);

    // stesso oggetto tra un render e l'altro: chi usa useToasts in un effetto non riparte a ogni toast
    const api = useMemo(() => ({ show, announce }), [show, announce]);

    return (
        <Ctx.Provider value={api}>
            {children}
            <div id="toasts" aria-live="polite">
                {[info, error].map(
                    (toast) =>
                        toast && (
                            <div key={toast.id} className={"toast" + (toast.error ? " toast--error" : "")}>
                                {toast.swatch && (
                                    <span className="toast__swatch" style={{ background: toast.swatch }} />
                                )}
                                {toast.icon && <Icon name={toast.icon} size={18} />}
                                <span>{toast.message}</span>
                                {toast.error && (
                                    <button
                                        className="toast__close"
                                        type="button"
                                        aria-label={t.toast.dismiss}
                                        onClick={() => setError(null)}
                                    >
                                        <Icon name="x" size={18} />
                                    </button>
                                )}
                            </div>
                        ),
                )}
            </div>
            <p className="sr-only" aria-live="polite">
                {message}
            </p>
        </Ctx.Provider>
    );
}
