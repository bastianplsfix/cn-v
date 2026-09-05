import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { build, preview } from "vite-plus";

const projectRoot = process.cwd();
const consumer = realpathSync(mkdtempSync(join(tmpdir(), "cn-ui-consumer-")));
let browser;
let server;

try {
  for (const cwd of [projectRoot, join(projectRoot, "packages/ui")]) {
    execFileSync("vp", ["pm", "pack", "--pack-destination", consumer], { cwd, stdio: "inherit" });
  }
  const tarballs = readdirSync(consumer);
  const uiTarball = tarballs.find((name) => name.startsWith("cn-variants-ui-"));
  const coreTarball = tarballs.find(
    (name) => name.startsWith("cn-variants-") && name !== uiTarball,
  );
  assert.ok(uiTarball && coreTarball);
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify({
      private: true,
      type: "module",
      packageManager: "npm@11.11.1",
      dependencies: {
        "@cn-variants/ui": `file:./${uiTarball}`,
        "cn-variants": `file:./${coreTarball}`,
        react: "^19.2.0",
        "react-dom": "^19.2.0",
      },
      devDependencies: { "@types/react": "^19.2.0", "@types/react-dom": "^19.2.0" },
    }),
  );
  execFileSync("vp", ["install", "--ignore-scripts"], { cwd: consumer, stdio: "inherit" });
  assert.equal(existsSync(join(consumer, "node_modules/tailwindcss")), false);
  const css = readFileSync(join(consumer, "node_modules/@cn-variants/ui/dist/styles.css"), "utf8");
  assert.doesNotMatch(css, /@(?:import|theme|source|apply|custom-variant)\b/);

  writeFileSync(
    join(consumer, "index.html"),
    '<div id="app"></div><p id="host">Host paragraph</p><script type="module" src="/main.tsx"></script>',
  );
  writeFileSync(
    join(consumer, "main.tsx"),
    `
import { createElement as h } from "react";
import { createRoot } from "react-dom/client";
import { Button, Badge } from "@cn-variants/ui";

// No CSS import and no Tailwind build plugin.
createRoot(document.getElementById("app")!).render(h("div", null,
  h(Button, { id: "primary", tone: "primary", children: "Save", onClick: () => { document.title = "clicked"; } }),
  h(Button, { id: "small", size: "sm", children: "Small" }),
  h(Button, { id: "disabled", disabled: true, children: "Disabled" }),
  h(Button, { id: "override", className: "ui:h-7", children: "Override" }),
  h(Button, { id: "custom", style: { height: 44 }, children: "Custom" }),
  h(Badge, { id: "badge", tone: "danger", children: "Danger" }),
));

// @ts-expect-error unsupported tone remains a compile-time error
h(Button, { tone: "unknown", children: "Invalid" });
`,
  );
  execFileSync(
    "vp",
    [
      "exec",
      "tsc",
      "--noEmit",
      "--strict",
      "--skipLibCheck",
      "--module",
      "nodenext",
      "--moduleResolution",
      "nodenext",
      "--target",
      "es2022",
      join(consumer, "main.tsx"),
    ],
    { cwd: projectRoot, stdio: "inherit" },
  );
  await build({ root: consumer, configFile: false, logLevel: "warn" });
  server = await preview({
    root: consumer,
    configFile: false,
    logLevel: "warn",
    preview: { host: "127.0.0.1", port: 0 },
  });
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(server.resolvedUrls.local[0]);
  await page.locator("#primary").waitFor();
  const style = (id, property) =>
    page
      .locator(`#${id}`)
      .evaluate((element, key) => getComputedStyle(element).getPropertyValue(key), property);
  assert.equal(await style("primary", "display"), "inline-flex");
  assert.equal(await style("primary", "height"), "32px");
  assert.equal(await style("primary", "padding-left"), "12px");
  assert.equal(await style("primary", "border-top-width"), "1px");
  assert.equal(await style("primary", "font-size"), "14px");
  assert.equal(await style("small", "height"), "28px");
  assert.equal(await style("override", "height"), "28px");
  assert.equal(await style("custom", "height"), "44px");
  assert.equal(await style("badge", "height"), "20px");
  assert.equal(await style("host", "margin-top"), "16px");
  assert.equal(
    await page.locator("body").evaluate((element) => getComputedStyle(element).margin),
    "8px",
  );
  const light = await style("primary", "background-color");
  assert.notEqual(light, "rgba(0, 0, 0, 0)");
  await page.locator("#primary").hover();
  assert.notEqual(await style("primary", "background-color"), light);
  await page.locator("#primary").click();
  assert.equal(await page.title(), "clicked");
  assert.equal(await page.locator("#disabled").isDisabled(), true);
  const disabledBackground = await style("disabled", "background-color");
  await page.locator("#disabled").hover();
  assert.equal(await style("disabled", "background-color"), disabledBackground);
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  assert.equal(await style("primary", "background-color"), "rgb(255, 255, 255)");
  assert.notEqual(await style("disabled", "color"), await style("primary", "color"));
  assert.deepEqual(errors, []);
  console.log(
    "UI tarball works without Tailwind: types, automatic CSS, variants, overrides, interactions, dark mode, and scoped reset passed.",
  );
} finally {
  await browser?.close();
  if (server)
    await new Promise((resolve, reject) =>
      server.httpServer.close((error) => (error ? reject(error) : resolve())),
    );
  rmSync(consumer, { recursive: true, force: true });
}
