import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("heading", { level: 1, name: "FinanceMeta" }).waitFor();
});

test("renders the evidence-bounded landing without horizontal overflow", async ({ page }) => {
  await expect(page.locator("#programs").getByRole("heading", { name: "Six routes. One standard." })).toBeVisible();
  await expect(page.getByText(/program families are in development/i)).toBeVisible();

  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
});

test("keeps the member handoff on the canonical FinanceMeta portal", async ({ page }) => {
  const handoff = page.getByRole("link", { name: "Open FinanceMeta member portal" });
  await expect(handoff).toHaveAttribute(
    "href",
    "https://finance4all-global-reach.vercel.app/login?utm_source=financemeta_landing&utm_medium=cta&utm_campaign=member_handoff",
  );
});

test("renders the operating field and exposes program details by keyboard", async ({ page }) => {
  const field = page.locator("canvas.flow-field");
  await expect(field).toHaveAttribute("data-rendered", "true");
  const paintedPixels = await field.evaluate((canvas: HTMLCanvasElement) => {
    const context = canvas.getContext("2d");
    if (!context) return 0;
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let painted = 0;
    for (let index = 3; index < pixels.length; index += 4) {
      if (pixels[index] > 0) painted += 1;
    }
    return painted;
  });
  expect(paintedPixels).toBeGreaterThan(100);

  const labs = page.getByRole("button", { name: /03\/labs.*financemeta labs/i });
  await labs.focus();
  await expect(page.locator(".program-detail").getByRole("heading", { name: "FinanceMeta Labs" })).toBeVisible();
  await expect(page.locator(".program-detail")).toContainText("A reproducible investigation");

  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("button", { name: /04\/chapters.*global chapters/i })).toBeFocused();
  await expect(page.locator(".program-detail").getByRole("heading", { name: "Global Chapters" })).toBeVisible();
});

test("couples the operating route and canvas state", async ({ page }) => {
  const field = page.locator("canvas.flow-field");
  await expect(field).toHaveAttribute("data-active-route", "1");

  await page.locator(".flow-index").getByRole("button", { name: /02\s*apply/i }).click();
  await expect(field).toHaveAttribute("data-active-route", "2");
  await expect(page.locator(".flow-index").getByText("Put a model against data, a decision, or a real constraint.")).toBeVisible();
});

test("makes the evidence threshold keyboard operable", async ({ page }) => {
  const threshold = page.getByRole("slider", { name: "Evidence threshold" });
  await threshold.scrollIntoViewIfNeeded();
  await threshold.focus();
  await page.keyboard.press("End");

  await expect(threshold).toHaveValue("3");
  await expect(page.getByText("ELIGIBLE FOR ACTIVATION")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Output reviewed" })).toBeVisible();
});

test("supports keyboard entry and persists the selected theme", async ({ page }) => {
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();

  const themeButton = page.getByRole("button", { name: /switch to (light|dark) theme/i });
  const originalState = await themeButton.getAttribute("aria-pressed");
  await themeButton.click();
  const selectedState = originalState === "true" ? "false" : "true";
  await expect(themeButton).toHaveAttribute("aria-pressed", selectedState);
  await page.reload();
  await expect(page.getByRole("button", { name: /switch to (light|dark) theme/i })).toHaveAttribute(
    "aria-pressed",
    selectedState,
  );
});

test("remains usable with enlarged root text", async ({ page }) => {
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expect(page.getByRole("heading", { level: 1, name: "FinanceMeta" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore the field" })).toBeVisible();
  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
});

test("has no automatically detectable accessibility violations", async ({ page }) => {
  const lightResults = await new AxeBuilder({ page }).analyze();
  expect(lightResults.violations).toEqual([]);

  const themeButton = page.getByRole("button", { name: /switch to (light|dark) theme/i });
  if ((await themeButton.getAttribute("aria-pressed")) === "true") await themeButton.click();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.waitForTimeout(300);
  const darkResults = await new AxeBuilder({ page }).analyze();
  expect(darkResults.violations).toEqual([]);
});
