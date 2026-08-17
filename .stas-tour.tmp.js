const { chromium } = require("playwright");
const fs = require("fs");

const BASE = "https://app.stasorganizer.com/";
const routes = [
  ["dashboard", "dashboard"],
  ["subscription", "companies/subscription"],
  ["notices", "noticeboardentries/index"],
  ["manage-workdays", "workdays/index"],
  ["tasks", "worktasks/index"],
  ["defect", "defectorders/index"],
  ["services", "defectorders/index/Service"],
  ["tracking-devices", "trackingdevices"],
  ["my-workdays", "workdays/entries"],
  ["projects", "constructionsites/index"],
  ["office", "office/index"],
  ["workshops", "workshops/index"],
  ["sources", "sources/index"],
  ["annual-realization", "constructionsites/annual-realization"],
  ["expired-items", "expiredItems"],
  ["awaiting-resolution", "awaitingresolution/index"],
  ["activity-tracing", "activitytracing/index"],
];

const OUT = "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\";

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: OUT + "stas-session.json",
    viewport: { width: 1600, height: 950 },
  });
  const page = await context.newPage();

  const notes = [];

  for (const [name, path] of routes) {
    try {
      await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 30000 });
      // wait for spinner/logo loader to clear
      for (let i = 0; i < 15; i++) {
        await page.waitForTimeout(1200);
        const spinnerGone = await page.locator("text=Getting things ready").count() === 0;
        if (spinnerGone) break;
      }
      await page.waitForTimeout(1500);
      const text = await page.locator("body").innerText().catch(() => "");
      notes.push(`=== ${name} (${path}) ===\n` + text.slice(0, 2500) + "\n");
      await page.screenshot({ path: `${OUT}tour-${name}.png` });
      console.log("done:", name);
    } catch (e) {
      console.log("FAILED:", name, e.message);
      notes.push(`=== ${name} (${path}) === FAILED: ${e.message}\n`);
    }
  }

  fs.writeFileSync(OUT + "tour-notes.txt", notes.join("\n\n"), "utf8");
  await browser.close();
  console.log("ALL DONE");
})();
