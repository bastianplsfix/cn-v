import { checkConsumerBundles } from "./consumer-bundles.mjs";
import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Track the package file separately from minified consumer bundles and peers.
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

const consumerBudgets = { variants: 320, createCn: 352, cn: 10240 };
const sizes = await checkConsumerBundles(process.cwd());
for (const [name, budget] of Object.entries(consumerBudgets)) {
  if (sizes[name] > budget) {
    throw new Error(`${name} consumer exceeds gzip budget: ${sizes[name]} > ${budget} bytes`);
  }
}
