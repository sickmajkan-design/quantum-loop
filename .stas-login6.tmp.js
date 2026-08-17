const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 950 } });
  await page.goto("https://app.stasorganizer.com/", { waitUntil: "domcontentloaded", timeout: 45000 }).catch((e) => console.log("nav1 error:", e.message));

  let found = false;
  for (let i = 0; i < 45; i++) {
    await page.waitForTimeout(2000);
    const passCount = await page.locator('input[type="password"]').count();
    if (passCount > 0) { found = true; break; }
    if ((i + 1) % 10 === 0) console.log("waiting,", (i + 1) * 2, "s");
  }
  console.log("password field found:", found, "after wait");
  console.log("URL:", page.url());
  await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-07-root.png" });

  if (found) {
    const userField = page.locator('input[name="username"], input[name="email"], input#username, input#email, input[type="text"], input[type="email"]').first();
    const passField = page.locator('input[type="password"]').first();
    if (await userField.count() > 0) await userField.fill("ZlatkoH");
    await passField.fill("MojaJovana.2");
    await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-08-filled.png" });
    const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Log in")').first();
    if (await submitBtn.count() > 0) {
      await submitBtn.click();
    } else {
      await passField.press("Enter");
    }
    await page.waitForTimeout(8000);
  } else {
    const bodyText = await page.locator("body").innerText().catch(() => "");
    console.log("BODY TEXT SNIPPET:", JSON.stringify(bodyText.slice(0, 500)));
  }

  console.log("URL after:", page.url());
  await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-09-final.png" });
  await page.context().storageState({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-session.json" });

  await browser.close();
})();
