import { test, expect, type Page } from "@playwright/test";
import { site, projects, experience, education } from "@/content/site";

async function goto(page: Page) {
  await page.goto("/");
}

test.describe("layout", () => {
  test("sections exist and are visible", async ({ page }) => {
    await goto(page);

    for (const selector of ["section#about", "section#projects", "section#experience", "section#education", "footer"]) {
      const el = page.locator(selector);
      await expect(el).toHaveCount(1);
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible();
    }
  });

  test("no horizontal overflow", async ({ page }) => {
    await goto(page);
    const overflowing = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    );
    expect(overflowing).toBe(true);
  });

  test("avatar: hidden on mobile, revealed on hover on desktop", async ({ page }, testInfo) => {
    await goto(page);
    const avatar = page.getByTestId("hero-avatar");

    if (testInfo.project.name !== "desktop") {
      await expect(avatar).toBeHidden();
      return;
    }

    const opacity = () => avatar.evaluate((el) => getComputedStyle(el).opacity);
    await expect
      .poll(() => avatar.locator("img").evaluate((el) => (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
    expect(await opacity()).toBe("0");
    await page.getByTestId("hero-name").hover();
    await expect.poll(opacity).toBe("1");
  });
});

test.describe("hero", () => {
  test("name and role", async ({ page }) => {
    await goto(page);

    const name = page.getByTestId("hero-name");
    await name.scrollIntoViewIfNeeded();
    await expect(name).toBeVisible();
    await expect(name).toHaveText(site.name);

    const role = page.getByTestId("hero-role");
    await expect(role).toBeVisible();
    await expect(role).toContainText(site.role);
  });

  test("nav pills on desktop, mobile CTA on mobile", async ({ page }, testInfo) => {
    await goto(page);
    const navPills = page.getByTestId("nav-pill");
    const mobileCta = page.getByTestId("mobile-cta");

    if (testInfo.project.name === "desktop") {
      await expect(navPills).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
        await expect(navPills.nth(i)).toBeVisible();
      }
    } else {
      const navPillCount = await navPills.count();
      for (let i = 0; i < navPillCount; i++) {
        await expect(navPills.nth(i)).toBeHidden();
      }
      await mobileCta.scrollIntoViewIfNeeded();
      await expect(mobileCta).toBeVisible();
    }
  });
});

test.describe("work", () => {
  test("one project-card per project, images decode", async ({ page }) => {
    await goto(page);
    const cards = page.getByTestId("project-card");
    await expect(cards).toHaveCount(projects.length);

    for (let i = 0; i < projects.length; i++) {
      const card = cards.nth(i);
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();

      const img = card.locator("img").first();
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(async () => img.evaluate((el) => (el as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
    }
  });
});

test.describe("experience", () => {
  test("one experience-row per role and education entry", async ({ page }) => {
    await goto(page);
    const rows = page.getByTestId("experience-row");
    await expect(rows).toHaveCount(experience.length + education.length);

    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      await row.scrollIntoViewIfNeeded();
      await expect(row).toBeVisible();
    }
  });
});

test.describe("footer", () => {
  test("four visible footer links", async ({ page }) => {
    await goto(page);
    const links = page.getByTestId("footer-link");
    await links.first().scrollIntoViewIfNeeded();
    await expect(links).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(links.nth(i)).toBeVisible();
    }
  });
});

test.describe("console health", () => {
  test("zero console errors or page errors during load", async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await goto(page);
    await page.waitForLoadState("networkidle");

    expect(consoleErrors, `console errors:\n${consoleErrors.join("\n")}`).toEqual([]);
    expect(pageErrors, `page errors:\n${pageErrors.join("\n")}`).toEqual([]);
  });
});

test.describe("screenshot artifact", () => {
  test("full page screenshot", async ({ page }, testInfo) => {
    await goto(page);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: `test-results/screens/${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});

test.describe("motion (reduced motion off)", () => {
  test.use({ reducedMotion: "no-preference" });

  test("hero reveal overlay resolves and role finishes typing", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "checked once, on desktop");

    await goto(page);
    await page.waitForTimeout(2500);

    const overlay = page.locator("[data-reveal-overlay]");
    const overlayCount = await overlay.count();
    if (overlayCount > 0) {
      const box = await overlay.first().boundingBox();
      const goneOrClipped = box === null || box.width === 0 || box.height === 0;
      expect(goneOrClipped).toBe(true);
    }

    const role = page.getByTestId("hero-role");
    const roleText = (await role.textContent())?.trim() ?? "";
    expect(roleText).toContain(site.role);
  });
});

test.describe("github graph", () => {
  test("hovering a day shows its tooltip", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "mouse-only tooltip");

    await goto(page);
    const section = page.locator("section#github");
    // The graph renders nothing if GitHub can't be reached at build time.
    test.skip((await section.count()) === 0, "graph not rendered (GitHub unreachable)");

    const svg = section.locator("svg:visible").first();
    await svg.scrollIntoViewIfNeeded();
    const box = (await svg.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 2); // top row: the ring must not clip

    const tip = section.locator("[data-open]");
    await expect(tip).toBeVisible();
    await expect(tip).toContainText(/contribution/i);
    await expect(tip).not.toContainText("{n}");
    await page.screenshot({ path: "test-results/screens/github-tooltip.png", clip: { x: box.x - 40, y: box.y - 60, width: box.width + 80, height: box.height + 80 } });

    await page.mouse.move(box.x + box.width / 2, box.y + box.height + 120);
    await expect(tip).toHaveCount(0);
  });
});
