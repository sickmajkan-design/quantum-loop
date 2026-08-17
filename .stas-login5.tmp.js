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

  const backToLogin = page.locator("text=Back to login");
  let clicked = false;
  for (let i = 0; i < 15; i++) {
    if (await backToLogin.count() > 0) {
      await backToLogin.click();
      clicked = true;
      break;
    }
    const passCount = await page.locator('input[type="password"]').count();
    if (passCount > 0) break;
    await page.waitForTimeout(2000);
  }
  console.log("clicked Back to login:", clicked);
  await page.waitForTimeout(3000);
  console.log("URL now:", page.url());
  await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-04-backtologin.png" });

  const passField = page.locator('input[type="password"]').first();
  const found = (await passField.count()) > 0;
  console.log("password field found:", found);

  if (found) {
    const userField = page.locator('input[name="username"], input[name="email"], input#username, input#email, input[type="text"], input[type="email"]').first();
    if (await userField.count() > 0) await userField.fill("ZlatkoH");
    await passField.fill("MojaJovana.2");
    await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-05-filled.png" });
    const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Log in")').first();
    if (await submitBtn.count() > 0) {
      await submitBtn.click();
    } else {
      await passField.press("Enter");
    }
    await page.waitForTimeout(8000);
  } else {
    const bodyText = await page.locator("body").innerText().catch(() => "");
    console.log("BODY TEXT SNIPPET:", bodyText.slice(0, 800));
  }

  console.log("URL after login attempt:", page.url());
  await page.screenshot({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-06-after-login.png" });
  await page.context().storageState({ path: "C:\\Users\\BIO-TE~1\\AppData\\Local\\Temp\\claude\\d--quantum-loop-VSCode\\6e62c44a-3224-4da0-bc98-5045a73d860b\\scratchpad\\stas-session.json" });

  await browser.close();
})();
