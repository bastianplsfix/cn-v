import { rolldown } from "rolldown";
import { join } from "node:path";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";

// Tree-shake test: importing only `variants` should not pull in clsx or tailwind-merge.
// This validates the `sideEffects: false` declaration and modular structure.

const distDir = join(process.cwd(), "dist");
const indexMjs = join(distDir, "index.mjs");

if (!existsSync(indexMjs)) {
  console.error("dist/index.mjs not found. Run `vp pack` first.");
  process.exit(1);
}

const tempDir = mkdtempSync(join(tmpdir(), "cn-variants-shake-"));
const entryFile = join(tempDir, "entry.mjs");

try {
  writeFileSync(entryFile, `import { variants } from "${indexMjs}";\nexport { variants };\n`);

  const build = await rolldown({
    input: entryFile,
    external: [],
  });

  const { output } = await build.generate({ format: "es" });
  const code = output[0].code;

  const forbidden = ["clsx", "tailwind-merge", "twMerge"];
  const found = forbidden.filter((name) => code.includes(name));

  if (found.length > 0) {
    console.error(
      `Tree-shaking failed: variants-only bundle includes [${found.join(", ")}].\n` +
        "Expected: variants should not pull in clsx or tailwind-merge when cn is unused.",
    );
    process.exit(1);
  }

  console.log("Tree-shaking verified: variants-only bundle excludes clsx and tailwind-merge.");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
