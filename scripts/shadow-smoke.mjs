import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { preview } from "vite-plus";

const appRoot = resolve("apps/shadow-demo");
const appPackage = JSON.parse(readFileSync(resolve(appRoot, "package.json"), "utf8"));
assert.equal(
  Object.keys({ ...appPackage.dependencies, ...appPackage.devDependencies }).some((name) =>
    name.includes("tailwind"),
  ),
  false,
);
const server = await preview({
  root: appRoot,
  configFile: false,
  logLevel: "warn",
  preview: { host: "127.0.0.1", port: 0 },
});
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(server.resolvedUrls.local[0]);
  const documentButton = page.locator('#document-demo [data-sample="primary"]');
  const shadowButton = page.locator('#styled-shadow [data-sample="primary"]');
  const bareButton = page.locator('#unstyled-shadow [data-sample="primary"]');
  await shadowButton.waitFor();
  const measure = (locator) =>
    locator.evaluate((element) => {
      const s = getComputedStyle(element);
      return {
        display: s.display,
        height: s.height,
        padding: s.paddingLeft,
        border: s.borderTopWidth,
        background: s.backgroundColor,
        color: s.color,
        font: s.fontSize,
      };
    });
  const expected = await measure(documentButton);
  assert.equal(expected.height, "32px");
  assert.equal(expected.border, "1px");
  assert.deepEqual(await measure(shadowButton), expected);
  assert.notEqual((await measure(bareButton)).display, "inline-flex");
  const shipped = readFileSync(resolve("packages/ui/dist/styles.css"), "utf8");
  assert.doesNotMatch(shipped, /@(?:import|theme|source|apply|custom-variant)\b/);
  assert.equal(
    await shadowButton.evaluate((element) => element.getRootNode() instanceof ShadowRoot),
    true,
  );
  await page
    .locator('#styled-shadow [data-property="height"]')
    .getByText("32px", { exact: true })
    .waitFor();
  await shadowButton.click();
  await page.locator("#styled-shadow").getByText("Clicked 1 time.", { exact: true }).waitFor();
  await page.getByLabel("Attach compiled CSS to shadow root").uncheck();
  assert.deepEqual(await measure(shadowButton), await measure(bareButton));
  await page.getByLabel("Attach compiled CSS to shadow root").check();
  assert.deepEqual(await measure(shadowButton), expected);
  await page.getByLabel("Add conflicting document CSS").check();
  assert.equal((await measure(documentButton)).height, "64px");
  assert.deepEqual(await measure(shadowButton), expected);
  await page.getByLabel("Dark samples").check();
  assert.equal((await measure(shadowButton)).background, "rgb(255, 255, 255)");
  assert.equal(
    await page
      .locator("#styled-shadow")
      .getByRole("button", { name: "Disabled", exact: true })
      .isDisabled(),
    true,
  );
  await page.getByLabel("Add conflicting document CSS").uncheck();
  await page.getByLabel("Dark samples").uncheck();
  await page.keyboard.press("Tab");
  await shadowButton.focus();
  assert.equal(
    await shadowButton.evaluate((element) => getComputedStyle(element).outlineWidth),
    "2px",
  );
  await page.screenshot({ path: resolve(appRoot, "dist/demo-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: resolve(appRoot, "dist/demo-mobile.png"), fullPage: true });

  // Remove document styles entirely: the shadow sample must not borrow its theme
  // or Tailwind property defaults from the component's automatic document import.
  await page.evaluate(() =>
    document
      .querySelectorAll('style, link[rel="stylesheet"]')
      .forEach((element) => element.remove()),
  );
  assert.deepEqual(await measure(shadowButton), expected);
  assert.equal(
    await shadowButton.evaluate((element) => getComputedStyle(element).outlineWidth),
    "2px",
  );
  assert.deepEqual(errors, []);
  console.log(
    "Shadow demo passed: compiled CSS, stylesheet toggle, host isolation, independent theme, focus, clicks, dark mode, and mobile layout.",
  );
} finally {
  await browser?.close();
  await new Promise((done, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : done())),
  );
}
