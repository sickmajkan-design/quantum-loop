const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 950 } });
  await page.goto("https://app.stasorganizer.com/", { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});

  let found = false;
  for (let i = 0; i < 45; i++) {
    await page.waitForTimeout(2000);
    if (await page.locator('input[type="password"]').count() > 0) { found = true; break; }
  }
  if (!found) { console.log("no login form"); await browser.close(); return; }

  const userField = page.getByPlaceholder("Username or email");
  await userField.click();
  await userField.fill("ZlatkoH");
  const passField = page.locator('input[type="password"]').first();
  await passField.click();
  await passField.fill("MojaJovana.2");

  console.log("username value:", await userField.inputValue());
  console.log("password length:", (await passField.inputValue()).length);

  await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-10-filled.png" });

  await page.locator('button:has-text("Log in")').first().click();
  await page.waitForTimeout(6000);

  console.log("URL after login:", page.url());
  await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-11-postlogin.png" });

  await page.context().storageState({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-session.json" });
  await browser.close();
})();
