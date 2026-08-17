const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-session.json",
    viewport: { width: 1600, height: 950 },
  });
  const page = await context.newPage();
  await page.goto("https://app.stasorganizer.com/home", { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(2000);
    if (await page.locator("text=Good day").count() > 0) break;
  }

  // dismiss cookie banner if present
  const declineCookies = page.locator('button:has-text("I don\'t accept Cookies")');
  if (await declineCookies.count() > 0) {
    await declineCookies.click().catch(() => {});
    await page.waitForTimeout(500);
  }
  console.log("URL:", page.url());
  await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-nav-00-dashboard.png", fullPage: true });

  // Collect all sidebar nav links: text + href (or data attrs if SPA router, hrefs might be relative)
  const navItems = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll("a, [role='button'], li").forEach((el) => {
      const text = el.innerText?.trim();
      if (text && text.length < 40 && text.length > 1) {
        const rect = el.getBoundingClientRect();
        if (rect.left < 280 && rect.width > 0 && rect.height > 0) {
          items.push({ text, tag: el.tagName, href: el.getAttribute("href") });
        }
      }
    });
    return items;
  });
  console.log("NAV ITEMS:", JSON.stringify(navItems, null, 1));

  await browser.close();
})();
