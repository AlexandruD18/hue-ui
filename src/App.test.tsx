import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { App } from "./App";
import { ToastProvider } from "./components/Toasts";
import { I18nProvider } from "./i18n";

const renderApp = (lang: "en" | "it" = "en") =>
    render(
        <I18nProvider initial={lang}>
            <ToastProvider>
                <App seed={42} />
            </ToastProvider>
        </I18nProvider>,
    );

beforeEach(() => {
    window.history.replaceState(null, "", "/");
    localStorage.clear();
});

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

    it("apre un link condiviso e tiene l'URL allineato alla palette", async () => {
        window.history.replaceState(null, "", "/?p=f7f4ee-ece6dc-1c1b1a-3e5bd0-c2410c");
        const user = userEvent.setup();
        renderApp();
        expect(hexOf("Primary")).toBe("#3E5BD0");
        expect(hexOf("Accent")).toBe("#C2410C");
        await user.click(screen.getAllByRole("button", { name: /^Generate$/ })[0] as HTMLElement);
        const p = new URLSearchParams(window.location.search).get("p");
        expect(p?.split("-")[0]).toBe(hexOf("Background")?.slice(1).toLowerCase());
    });

    it("un link rotto dà una palette nuova e lo dice", () => {
        window.history.replaceState(null, "", "/?p=nope");
        renderApp();
        expect(
            screen.getByText("That link didn't contain a valid palette, so here's a fresh one."),
        ).toBeInTheDocument();
    });

    it("dopo Apply fix il focus torna al pulsante Why? e la coppia passa", async () => {
        window.history.replaceState(null, "", "/?p=ffffff-ffffff-eeeeee-3e5bd0-c2410c");
        const user = userEvent.setup();
        renderApp();
        const why = screen.getByRole("button", { name: /^Why\? Text:/ });
        await user.click(why);
        await user.click(screen.getByRole("button", { name: "Apply fix" }));
        await new Promise((r) => requestAnimationFrame(r));
        expect(screen.getByRole("button", { name: /^Why\? Text:/ })).toHaveFocus();
        expect(screen.getByText(/^Fix applied\./)).toBeInTheDocument();
    });

    it("Spazio genera dopo un clic su un pulsante, ma lo preme se ci si arriva con Tab", async () => {
        const user = userEvent.setup();
        renderApp();
        const lock = screen.getByRole("button", { name: "Lock Text" });
        await user.click(lock);
        const background = hexOf("Background");
        await user.keyboard(" ");
        expect(lock).toHaveAttribute("aria-pressed", "true");
        expect(hexOf("Background")).not.toBe(background);

        const why = screen.getByRole("button", { name: /^Why\? Text:/ });
        lock.focus();
        await user.tab();
        expect(why).toHaveFocus();
        await user.keyboard(" ");
        expect(why).toHaveAttribute("aria-expanded", "true");
    });

    it("Share copia il link", async () => {
        const user = userEvent.setup();
        renderApp();
        await user.click(screen.getAllByRole("button", { name: "Share palette link" })[0] as HTMLElement);
        expect(await navigator.clipboard.readText()).toContain("?p=");
        expect(screen.getByText("Link copied. Anyone with it sees this palette.")).toBeInTheDocument();
    });

    it("L blocca la fascia selezionata, ? apre le scorciatoie, l'interruttore spegne i tasti singoli", async () => {
        const user = userEvent.setup();
        renderApp();
        const lock = screen.getByRole("button", { name: "Lock Text" });
        lock.focus();
        await user.keyboard("l");
        expect(lock).toHaveAttribute("aria-pressed", "true");
        await user.keyboard("?");
        const dialog = screen.getByRole("dialog", { hidden: true });
        expect(
            within(dialog).getByRole("heading", { name: "Keyboard shortcuts", hidden: true }),
        ).toBeInTheDocument();
        await user.click(within(dialog).getByRole("checkbox", { hidden: true }));
        expect(localStorage.getItem("hue-single-keys")).toBe("off");
        await user.click(within(dialog).getByRole("button", { name: "Close", hidden: true }));
        lock.focus();
        await user.keyboard("l");
        expect(lock).toHaveAttribute("aria-pressed", "true");
    });

    it("passa all'italiano dal piè di pagina", async () => {
        const user = userEvent.setup();
        renderApp();
        await user.click(screen.getByRole("button", { name: "Italiano" }));
        expect(screen.getByRole("button", { name: "Italiano" })).toHaveAttribute("aria-current", "true");
        expect(screen.getAllByRole("button", { name: /^Genera$/ }).length).toBeGreaterThan(0);
        expect(document.documentElement.lang).toBe("it");
        expect(new URLSearchParams(window.location.search).get("lang")).toBe("it");
        expect(localStorage.getItem("hue-lang")).toBe("it");
    });

    it("non ha violazioni axe", async () => {
        const { container } = renderApp();
        const results = await axe(container);
        expect(results.violations).toEqual([]);
    });

    it("non ha violazioni axe in italiano", async () => {
        const { container } = renderApp("it");
        const results = await axe(container);
        expect(results.violations).toEqual([]);
    });
});
