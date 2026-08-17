const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 950 } });
  await page.goto("https://app.stasorganizer.com/home", { waitUntil: "domcontentloaded", timeout: 45000 }).catch((e) => console.log("nav1 error:", e.message));

  let ready = false;
  for (let i = 0; i < 60; i++) {
    await page.waitForTimeout(3000);
    const stillLoading = await page.locator("text=Getting things ready").count();
    if (stillLoading === 0) { ready = true; break; }
    if ((i + 1) % 5 === 0) console.log("still loading, waited", (i + 1) * 3, "s");
  }
  console.log("ready:", ready);

  console.log("URL:", page.url());
  await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-01c-loaded.png" });

  const userField = page.locator('input[name="username"], input[type="text"], input[name="email"], #username, #email').first();
  const passField = page.locator('input[type="password"]').first();

  if (await passField.count() > 0) {
    if (await userField.count() > 0) await userField.fill("ZlatkoH");
    await passField.fill("MojaJovana.2");
    await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-02-filled.png" });
    const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Prijava")').first();
    await submitBtn.click().catch(async () => { await passField.press("Enter"); });
    await page.waitForTimeout(5000);
  } else {
    console.log("No password field found after load wait");
  }

  console.log("URL after login attempt:", page.url());
  await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-03-after-login.png" });

  await page.context().storageState({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-session.json" });

  await browser.close();
})();
