import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const SHARED = "f7f4ee-ece6dc-1c1b1a-3e5bd0-c2410c";

const axe = (page: Page) =>
    new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();

test("la home si apre ed è accessibile", async ({ page }) => {
    await page.goto("./?lang=en");
    await expect(page.getByRole("heading", { level: 1, name: "Hue UI" })).toBeVisible();
    expect((await axe(page)).violations).toEqual([]);
});

test("il percorso della demo: genera, blocca, annulla, condividi", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(`./?p=${SHARED}&lang=en`);
    const primary = page.getByRole("button", { name: /^Copy Primary color, #/ });
    await expect(primary).toHaveText("#3E5BD0");

    await page.getByRole("button", { name: "Lock Primary" }).click();
    // dopo un clic il focus resta sul lucchetto senza vedersi: Spazio deve generare, non sbloccare
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: "Lock Primary" })).toHaveAttribute("aria-pressed", "true");
    await expect(primary).toHaveText("#3E5BD0");
    await expect(page).not.toHaveURL(new RegExp(SHARED));

    await page.keyboard.press("Control+z");
    await expect(page).toHaveURL(new RegExp(SHARED));

    await page.getByRole("button", { name: "Share palette link" }).first().click();
    await expect(page.getByText("Link copied. Anyone with it sees this palette.")).toBeVisible();
});

test("le scorciatoie si aprono con ? e si chiudono con Esc", async ({ page }) => {
    await page.goto("./?lang=en");
    await page.keyboard.press("?");
    const dialog = page.getByRole("dialog", { name: "Keyboard shortcuts" });
    await expect(dialog).toBeVisible();
    expect((await axe(page)).violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
});

test("in italiano è tradotta e accessibile", async ({ page }) => {
    await page.goto("./?lang=it");
    await expect(page.locator("html")).toHaveAttribute("lang", "it");
    await expect(page.getByRole("button", { name: /^Genera$/ }).first()).toBeVisible();
    expect((await axe(page)).violations).toEqual([]);
});

test("Why? si apre e si richiude senza errori", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`./?p=${SHARED}&lang=en`);
    const why = page.getByRole("button", { name: /^Why\? Text:/ });
    await why.click();
    await expect(why).toHaveAttribute("aria-expanded", "true");
    await why.click();
    await expect(why).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("heading", { level: 1, name: "Hue UI" })).toBeVisible();
    expect(errors).toEqual([]);
});
