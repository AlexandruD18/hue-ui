import { act, render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { I18nProvider } from "../i18n";
import { ToastProvider, useToasts } from "./Toasts";

function Fire({ steps }: { steps: Parameters<ReturnType<typeof useToasts>["show"]>[0][] }) {
    const toasts = useToasts();
    useEffect(() => {
        steps.forEach((s) => toasts.show(s));
    }, [steps, toasts]);
    return null;
}

describe("toast", () => {
    it("un messaggio nuovo non cancella l'errore aperto", () => {
        vi.useFakeTimers();
        render(
            <I18nProvider initial="en">
                <ToastProvider>
                    <Fire
                        steps={[
                            { message: "Couldn't copy.", error: true },
                            { message: "Link copied.", icon: "link" },
                        ]}
                    />
                </ToastProvider>
            </I18nProvider>,
        );
        expect(screen.getByText("Couldn't copy.")).toBeInTheDocument();
        expect(screen.getByText("Link copied.")).toBeInTheDocument();
        act(() => vi.advanceTimersByTime(4500));
        expect(screen.queryByText("Link copied.")).not.toBeInTheDocument();
        expect(screen.getByText("Couldn't copy.")).toBeInTheDocument();
        vi.useRealTimers();
    });
});
