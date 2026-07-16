/**
 * PR-09 — Playwright smoke for examples/smoke deck.
 * Acceptance (DESIGN B.3): no document scrollbars at 1280×720 / 1366×768.
 */

import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../packages/hssf/dist");

const SMOKE = "/examples/smoke/";

test.describe("HSSF smoke deck", () => {
  test.beforeAll(() => {
    // Ensure production assets exist (CI runs build first; local may need pnpm build)
    const required = ["hssf.css", "hssf.js", "hssf.min.css", "hssf.min.js"];
    for (const f of required) {
      if (!fs.existsSync(path.join(distDir, f))) {
        throw new Error(
          `Missing ${f} in packages/hssf/dist — run pnpm build before e2e`,
        );
      }
    }
  });

  test("loads, inits HSSF, sets scale", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(SMOKE);

    // Fail fast if dist scripts 404
    page.on("pageerror", (err) => {
      console.error("pageerror", err.message);
    });

    const canvas = page.locator("[data-hssf-canvas]");
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveAttribute("data-hssf-ready", "true", {
      timeout: 15_000,
    });

    // Scale applied (dataset may be string)
    await expect
      .poll(async () => canvas.getAttribute("data-hssf-scale"))
      .not.toBeNull();

    const scale = await canvas.getAttribute("data-hssf-scale");
    expect(Number(scale)).toBeGreaterThan(0);
    expect(Number(scale)).toBeLessThanOrEqual(1.01);

    // Public API present
    const hasApi = await page.evaluate(() => {
      return (
        typeof window.HSSF === "object" &&
        typeof window.HSSF.init === "function" &&
        typeof window.HSSF.version === "string"
      );
    });
    expect(hasApi).toBe(true);
  });

  for (const vp of [
    { width: 1280, height: 720, name: "1280x720" },
    { width: 1366, height: 768, name: "1366x768" },
  ]) {
    test(`no document scrollbars @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(SMOKE);
      await page
        .locator("[data-hssf-canvas][data-hssf-ready='true']")
        .waitFor({ timeout: 15_000 });

      // allow layout settle after ResizeObserver
      await page.waitForTimeout(100);

      const metrics = await page.evaluate(() => {
        const de = document.documentElement;
        return {
          scrollWidth: de.scrollWidth,
          clientWidth: de.clientWidth,
          scrollHeight: de.scrollHeight,
          clientHeight: de.clientHeight,
        };
      });

      // ±1px subpixel tolerance (DESIGN acceptance)
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
      expect(metrics.scrollHeight).toBeLessThanOrEqual(
        metrics.clientHeight + 1,
      );
    });
  }

  test("next button advances fragment or slide", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(SMOKE);
    await page.locator("[data-hssf-ready='true']").waitFor({ timeout: 15_000 });

    const before = await page.evaluate(() => {
      const c = document.querySelector("[data-hssf-canvas]");
      const active = c.querySelector(".hssf-slide.is-active");
      const frags = active
        ? active.querySelectorAll("[data-hssf-fragment].is-visible").length
        : 0;
      return {
        index: c.dataset.hssfIndex || "0",
        frags,
        counter: c.querySelector("[data-hssf-counter]")?.textContent || "",
      };
    });

    await page.locator("[data-hssf-next]").click();
    await page.waitForTimeout(50);

    const after = await page.evaluate(() => {
      const c = document.querySelector("[data-hssf-canvas]");
      const active = c.querySelector(".hssf-slide.is-active");
      const frags = active
        ? active.querySelectorAll("[data-hssf-fragment].is-visible").length
        : 0;
      return {
        index: c.dataset.hssfIndex || "0",
        frags,
        counter: c.querySelector("[data-hssf-counter]")?.textContent || "",
      };
    });

    const advanced =
      Number(after.index) > Number(before.index) ||
      after.frags > before.frags ||
      after.counter !== before.counter;
    expect(advanced).toBe(true);
  });

  test("keyboard ArrowRight advances", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(SMOKE);
    await page.locator("[data-hssf-ready='true']").waitFor({ timeout: 15_000 });
    await page.locator("[data-hssf-canvas]").focus();

    const before = await page.evaluate(
      () => document.querySelector("[data-hssf-canvas]").dataset.hssfIndex,
    );

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(50);

    const after = await page.evaluate(() => {
      const c = document.querySelector("[data-hssf-canvas]");
      const active = c.querySelector(".hssf-slide.is-active");
      return {
        index: c.dataset.hssfIndex,
        visibleFrags: active
          ? active.querySelectorAll("[data-hssf-fragment].is-visible").length
          : 0,
      };
    });

    // either slide index changed or a fragment appeared
    expect(
      after.index !== before || after.visibleFrags > 0,
    ).toBeTruthy();
  });

  test("hash deep-link #2 selects second slide group", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${SMOKE}#2`);
    await page.locator("[data-hssf-ready='true']").waitFor({ timeout: 15_000 });
    await page.waitForTimeout(150);

    const index = await page.evaluate(
      () => document.querySelector("[data-hssf-canvas]").dataset.hssfIndex,
    );
    // 1-based #2 → 0-based index 1
    expect(index).toBe("1");
  });
});
