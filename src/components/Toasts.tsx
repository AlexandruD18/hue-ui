import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
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
 */
export function ToastProvider({ children }: { children: ReactNode }) {
    const { t } = useI18n();
    const [toast, setToast] = useState<ToastData | null>(null);
    const [message, setMessage] = useState("");
    const timer = useRef<number | undefined>(undefined);
    const n = useRef(0);

    const show = useCallback((data: Omit<ToastData, "id">) => {
        window.clearTimeout(timer.current);
        setToast({ ...data, id: ++n.current });
        if (!data.error) timer.current = window.setTimeout(() => setToast(null), 4000);
    }, []);

    const announce = useCallback((msg: string) => {
        setMessage("");
        window.setTimeout(() => setMessage(msg), 30);
    }, []);

    return (
        <Ctx.Provider value={{ show, announce }}>
            {children}
            <div id="toasts" aria-live="polite">
                {toast && (
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
                                onClick={() => setToast(null)}
                            >
                                <Icon name="x" size={18} />
                            </button>
                        )}
                    </div>
                )}
            </div>
            <p className="sr-only" aria-live="polite">
                {message}
            </p>
        </Ctx.Provider>
    );
}
