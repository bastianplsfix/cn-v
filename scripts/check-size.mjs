import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// The budget covers the full entry point: the single ESM export bundles
// cn, createCn, and variants together, even though consumers who import
// only one of them tree-shake the rest in their own bundlers.
const BUDGET_BYTES = 1536;

const distDir = join(process.cwd(), "dist");
const size = gzipSync(readFileSync(join(distDir, "index.mjs"))).length;

console.log(`dist/index.mjs gzipped: ${size} bytes (budget: ${BUDGET_BYTES})`);

if (size > BUDGET_BYTES) {
  console.error(
    `Bundle size budget exceeded: ${size} > ${BUDGET_BYTES} bytes. ` +
      "If the growth is intentional, update BUDGET_BYTES in scripts/check-size.mjs.",
  );
  process.exit(1);
}
