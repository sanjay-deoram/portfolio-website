import { test, expect } from "@playwright/test";
import { education, experience, projects } from "@/content/site";

test.describe("side nav", () => {
  test("hidden on mobile, lists every target on desktop", async ({ page }, testInfo) => {
    await page.goto("/");
    const nav = page.getByTestId("side-nav");

    if (testInfo.project.name !== "desktop") {
      await expect(nav).toBeHidden();
      return;
    }

    await expect(nav).toBeVisible();
    const items = nav.getByTestId("side-nav-item");
    await expect(items).toHaveCount(projects.length + experience.length + education.length);
    for (const label of [...projects.map((p) => p.name), ...experience.map((r) => r.navLabel ?? r.company)]) {
      await expect(nav.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("nothing active over the hero; scroll-spy follows the page", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop only");
    await page.goto("/");
    const nav = page.getByTestId("side-nav");

    await expect(nav.locator('[aria-current="location"]')).toHaveCount(0);

    const role = experience[1];
    // Park the row's top just above the spy line (35% of the viewport) — scrolling
    // it to the very top can pull the next, shorter row past the line too.
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3);
    }, `experience-${role.id}`);
    await expect(nav.getByRole("link", { name: role.navLabel ?? role.company })).toHaveAttribute("aria-current", "location");
  });

  test("clicking an item scrolls to it and marks it active", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop only");
    await page.goto("/");
    const nav = page.getByTestId("side-nav");

    const project = projects[projects.length - 1];
    const link = nav.getByRole("link", { name: project.name });
    await link.click();

    await expect(page.locator(`#project-${project.id}`)).toBeInViewport();
    await expect(link).toHaveAttribute("aria-current", "location");
    expect(await page.evaluate(() => location.hash)).toBe(`#project-${project.id}`);
  });
});
