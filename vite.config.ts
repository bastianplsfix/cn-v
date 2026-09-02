import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    dts: true,
  },
  lint: {
    ignorePatterns: ["apps/**", "packages/**"],
    options: { typeAware: true, typeCheck: true },
  },
});
