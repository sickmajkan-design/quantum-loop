const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 950 } });
  await page.goto("https://app.stasorganizer.com/home", { waitUntil: "domcontentloaded", timeout: 45000 }).catch((e) => console.log("nav1 error:", e.message));

  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(2000);
    const stillLoading = await page.locator("text=Getting things ready").count();
    if (stillLoading === 0) break;
  }

  // Now wait for either a password field or a spinner to go away.
  let found = false;
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(2000);
    const passCount = await page.locator('input[type="password"]').count();
    if (passCount > 0) { found = true; break; }
    if ((i + 1) % 5 === 0) console.log("waiting for login form,", (i + 1) * 2, "s");
  }
  console.log("password field found:", found);
  console.log("URL:", page.url());
  await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-01d-loaded.png" });

  if (found) {
    const userField = page.locator('input[name="username"], input[name="email"], input#username, input#email, input[type="text"]').first();
    const passField = page.locator('input[type="password"]').first();
    if (await userField.count() > 0) await userField.fill("ZlatkoH");
    await passField.fill("MojaJovana.2");
    await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-02-filled.png" });
    const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Prijava"), button:has-text("Log in")').first();
    if (await submitBtn.count() > 0) {
      await submitBtn.click();
    } else {
      await passField.press("Enter");
    }
    await page.waitForTimeout(6000);
  } else {
    // Dump visible text to understand what's on screen instead.
    const bodyText = await page.locator("body").innerText().catch(() => "");
    console.log("BODY TEXT SNIPPET:", bodyText.slice(0, 500));
  }

  console.log("URL after login attempt:", page.url());
  await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-03-after-login.png" });
  await page.context().storageState({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-session.json" });

  await browser.close();
})();
