import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("la home si apre ed è accessibile", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1, name: "Hue UI" })).toBeVisible();
    const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
    expect(results.violations).toEqual([]);
});
