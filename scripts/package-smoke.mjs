import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const projectRoot = process.cwd();
const smokeRoot = mkdtempSync(join(tmpdir(), "cn-variants-smoke-"));

function run(command, args) {
  execFileSync(command, args, { cwd: smokeRoot, stdio: "inherit" });
}

try {
  execFileSync("vp", ["pm", "pack", "--pack-destination", smokeRoot], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  const tarballName = readdirSync(smokeRoot).find((file) => file.endsWith(".tgz"));
  if (!tarballName) throw new Error("Package tarball was not created");
  const tarball = join(smokeRoot, tarballName);

  writeFileSync(
    join(smokeRoot, "package.json"),
    `${JSON.stringify(
      {
        private: true,
        type: "module",
        packageManager: "npm@11.11.1",
        dependencies: {
          "cn-variants": `file:${tarball}`,
        },
        devDependencies: {
          typescript: "5.9.3",
        },
      },
      null,
      2,
    )}\n`,
  );

  writeFileSync(
    join(smokeRoot, "smoke.mjs"),
    `
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { cn, variants } from "cn-variants";

assert.equal(cn("px-2", "px-4"), "px-4");

const source = { sm: "text-sm" };
const size = variants(source);
assert.equal(size("sm"), "text-sm");
assert.notEqual(size.options, source);
assert.equal(Object.isFrozen(source), false);

const require = createRequire(import.meta.url);
assert.throws(
  () => require("cn-variants"),
  (error) => error?.code === "ERR_PACKAGE_PATH_NOT_EXPORTED",
);
`,
  );

  writeFileSync(
    join(smokeRoot, "smoke.ts"),
    `
import { type ClassValue, cn, variants } from "cn-variants";

const inputs: ClassValue[] = ["px-2", { "px-4": true }];
cn(...inputs);

const size = variants({ sm: "text-sm", lg: "text-lg" });
size("sm");

// @ts-expect-error unknown variant keys are rejected
size("xl");

// @ts-expect-error options are readonly
size.options.sm = "text-base";
`,
  );

  writeFileSync(
    join(smokeRoot, "basic.ts"),
    readFileSync(join(projectRoot, "examples/basic.ts"), "utf8"),
  );

  run("vp", ["install", "--ignore-scripts"]);
  run("node", ["smoke.mjs"]);
  run("vp", [
    "exec",
    "tsc",
    "--noEmit",
    "--strict",
    "--target",
    "es2022",
    "--module",
    "nodenext",
    "--moduleResolution",
    "nodenext",
    "smoke.ts",
    "basic.ts",
  ]);
} finally {
  rmSync(smokeRoot, { recursive: true, force: true });
}
