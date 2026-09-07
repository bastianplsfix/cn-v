import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { build } from "vite-plus";

// Use public imports from the supplied consumer directory. In the package smoke
// test this resolves the installed tarball, not the repository's source files.
export async function checkConsumerBundles(consumerRoot) {
  const fixtureRoot = mkdtempSync(join(consumerRoot, ".bundle-check-"));
  const sizes = {};
  try {
    for (const name of ["variants", "createCn", "cn"]) {
      const entry = join(fixtureRoot, `${name}.mjs`);
      writeFileSync(entry, `export { ${name} } from "cn-variants";\n`);
      const result = await build({
        root: consumerRoot,
        configFile: false,
        logLevel: "silent",
        resolve: { tsconfigPaths: false },
        build: {
          write: false,
          minify: true,
          rolldownOptions: {
            input: entry,
            preserveEntrySignatures: "strict",
            output: { format: "es" },
          },
        },
      });
      const outputs = Array.isArray(result) ? result : [result];
      assert.equal(outputs.length, 1);
      assert.ok("output" in outputs[0]);
      const chunks = outputs[0].output.filter((output) => output.type === "chunk");
      assert.equal(chunks.length, 1, `${name} should produce one self-contained chunk`);
      const chunk = chunks[0];
      assert.deepEqual(chunk.imports, [], `${name} should have no external imports`);
      assert.deepEqual(chunk.exports, [name]);
      const modules = Object.entries(chunk.modules)
        .filter(([, module]) => module.renderedLength > 0)
        .map(([id]) => id.replaceAll("\\", "/"));
      for (const peer of ["clsx", "tailwind-merge"]) {
        const included = modules.some((id) => id.includes(`/node_modules/${peer}/`));
        const expected = name === "cn" || (name === "createCn" && peer === "clsx");
        assert.equal(included, expected, `${name}: unexpected ${peer} inclusion`);
      }
      // Execute the bundle too, so a broken/empty result cannot pass size checks.
      const bundled = await import(
        `data:text/javascript;base64,${Buffer.from(chunk.code).toString("base64")}`
      );
      if (name === "variants") {
        assert.equal(bundled.variants({ sm: ["px-2", "text-sm"] })("sm"), "px-2 text-sm");
      } else if (name === "createCn") {
        assert.equal(bundled.createCn((classes) => classes)("base", { flex: true }), "base flex");
      } else {
        assert.equal(bundled.cn("px-2", "px-4"), "px-4");
      }
      sizes[name] = gzipSync(chunk.code).length;
      console.log(`${name} consumer: ${sizes[name]} bytes gzip (including retained peers)`);
    }
    return sizes;
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
}
