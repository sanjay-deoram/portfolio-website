import { chromium, type FullConfig } from "@playwright/test";

// On a fresh build, Next's image optimizer resizes each screenshot on first
// request. When every parallel worker asks for the same cold images at once
// those requests stall, so warm the cache once — at both viewport sizes, all
// the way down the page so lazy images load — before the suite starts.
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL;
  if (!baseURL) return;

  const browser = await chromium.launch();
  for (const viewport of [
    { width: 1440, height: 900, deviceScaleFactor: 1 },
    { width: 390, height: 844, deviceScaleFactor: 2 },
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: viewport.deviceScaleFactor });
    await page.goto(baseURL);
    for (const img of await page.locator("img").all()) {
      await img.scrollIntoViewIfNeeded().catch(() => {});
    }
    await page.waitForLoadState("networkidle");
    await page.close();
  }
  await browser.close();
}
