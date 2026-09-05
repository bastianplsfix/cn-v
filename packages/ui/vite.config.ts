import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/index.ts"],
    dts: true,
    // CSS is compiled separately by Tailwind; keep its import in the JS output.
    deps: { neverBundle: [/\.css$/] },
  },
});
