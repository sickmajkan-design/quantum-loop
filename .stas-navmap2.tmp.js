const { chromium } = require("playwright");
const OUT = "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\";
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: OUT + "stas-session.json",
    viewport: { width: 1600, height: 950 },
  });
  const page = await context.newPage();
  await page.goto("https://app.stasorganizer.com/home", { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(1500);
    if (await page.locator("text=Good day").count() > 0) break;
  }

  // Expand all collapsible sidebar groups by clicking their headers.
  const groups = ["WORKERS", "ADVERTISEMENTS", "ORDERS", "ITEMS", "REPORTS", "VEHICLES", "FINANCES", "ASSOCIATES", "TEMPLATES"];
  for (const g of groups) {
    const el = page.locator(`text=${g}`).first();
    if (await el.count() > 0) await el.click().catch(() => {});
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(1000);

  const navItems = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll("a").forEach((el) => {
      const text = el.innerText?.trim();
      const href = el.getAttribute("href");
      if (text && href && href.length > 0 && href !== "#") {
        items.push({ text, href });
      }
    });
    return items;
  });
  console.log("NAV ITEMS:", JSON.stringify(navItems, null, 1));
  await page.screenshot({ path: OUT + "nav-expanded.png", fullPage: true });

  await browser.close();
})();
