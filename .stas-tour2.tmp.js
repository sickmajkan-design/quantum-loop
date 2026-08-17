const { chromium } = require("playwright");
const fs = require("fs");

const BASE = "https://app.stasorganizer.com/";
const routes = [
  ["workers-manage", "workers/index"],
  ["teams", "teams/index"],
  ["worker-assignments", "workers/assignations"],
  ["hierarchy", "hierarchy"],
  ["availability", "availability/index"],
  ["paid-vacation-days", "workers/paidvacationdays"],
  ["applicants", "workers/applicants"],
  ["items-manage", "items/index"],
  ["item-assign-requests", "itemassignrequests/index"],
  ["work-orders", "workorders/index"],
  ["supply-orders", "supplyorders/index"],
  ["hours-report", "workdaysummary"],
  ["general-finance-report", "finances/report"],
  ["finance-entries", "finances/entries"],
  ["vehicle-statistics", "finances/statistics/vehicle"],
  ["fuel-cards", "fuelcards/index"],
  ["external-customers", "externalcustomers/index"],
  ["work-diaries", "diaries/index"],
  ["advertisements-mine", "advertisements/mine"],
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
      for (let i = 0; i < 15; i++) {
        await page.waitForTimeout(1200);
        const spinnerGone = await page.locator("text=Getting things ready").count() === 0
          && await page.locator("text=GETTING DATA READY").count() === 0;
        if (spinnerGone) break;
      }
      await page.waitForTimeout(2000);
      const text = await page.locator("body").innerText().catch(() => "");
      notes.push(`=== ${name} (${path}) ===\n` + text.slice(0, 2500) + "\n");
      await page.screenshot({ path: `${OUT}tour2-${name}.png` });
      console.log("done:", name);
    } catch (e) {
      console.log("FAILED:", name, e.message);
      notes.push(`=== ${name} (${path}) === FAILED: ${e.message}\n`);
    }
  }

  fs.writeFileSync(OUT + "tour2-notes.txt", notes.join("\n\n"), "utf8");
  await browser.close();
  console.log("ALL DONE");
})();
