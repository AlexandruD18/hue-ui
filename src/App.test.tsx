import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { App } from "./App";
import { ToastProvider } from "./components/Toasts";
import { I18nProvider } from "./i18n";

const renderApp = () =>
    render(
        <I18nProvider>
            <ToastProvider>
                <App seed={42} />
            </ToastProvider>
        </I18nProvider>,
    );

const hexOf = (role: string) =>
    screen.getByRole("button", { name: new RegExp(`^Copy ${role} color, #`) }).textContent;

describe("App", () => {
    it("mostra il nome del prodotto e 5 fasce", () => {
        renderApp();
        expect(screen.getByRole("heading", { level: 1, name: "Hue UI" })).toBeInTheDocument();
        expect(within(screen.getByRole("list", { name: "Palette" })).getAllByRole("listitem")).toHaveLength(
            5,
        );
    });

    it("Generate cambia i colori, Lock li tiene, Undo torna indietro", async () => {
        const user = userEvent.setup();
        renderApp();
        const lock = screen.getByRole("button", { name: "Lock Primary" });
        await user.click(lock);
        expect(lock).toHaveAttribute("aria-pressed", "true");
        const primary = hexOf("Primary");
        const background = hexOf("Background");
        await user.click(screen.getAllByRole("button", { name: /^Generate$/ })[0] as HTMLElement);
        expect(hexOf("Primary")).toBe(primary);
        expect(hexOf("Background")).not.toBe(background);
        await user.click(screen.getAllByRole("button", { name: /Undo/ })[0] as HTMLElement);
        expect(hexOf("Background")).toBe(background);
    });

    it("Why? si apre e si chiude con Esc", async () => {
        const user = userEvent.setup();
        renderApp();
        const why = screen.getByRole("button", { name: /^Why\? Primary/ });
        await user.click(why);
        expect(why).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByRole("region", { name: /^Why\?/ })).toBeInTheDocument();
        await user.keyboard("{Escape}");
        expect(why).toHaveAttribute("aria-expanded", "false");
        expect(why).toHaveFocus();
    });

    it("il campo HEX segnala un codice non valido", async () => {
        const user = userEvent.setup();
        renderApp();
        await user.click(screen.getByRole("button", { name: /^Edit Accent color/ }));
        const input = screen.getByRole("textbox", { name: "Accent color, hex code" });
        await user.clear(input);
        await user.type(input, "#3e5bd{Enter}");
        expect(screen.getByRole("alert")).toHaveTextContent("Use a hex code like #3E5BD0.");
        await user.clear(input);
        await user.type(input, "#c0362c{Enter}");
        expect(hexOf("Accent")).toBe("#C0362C");
        expect(screen.getByRole("button", { name: "Lock Accent" })).toHaveAttribute("aria-pressed", "true");
    });

    it("non ha violazioni axe", async () => {
        const { container } = renderApp();
        const results = await axe(container);
        expect(results.violations).toEqual([]);
    });
});
