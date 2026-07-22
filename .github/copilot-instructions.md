# cn-variants repository instructions

Follow the complete project guidance in `/AGENTS.md` and read `/DESIGN.md` before expanding the public API.

- This is a tiny, ESM-only TypeScript library. Its runtime API is `cn` and `variants`.
- Preserve literal-key inference, the frozen `.options` snapshot, safe unknown-key behavior, and module separation for tree-shaking.
- Keep defaults and compound variants in userland JavaScript; do not introduce a CVA-style configuration DSL.
- Use Vite+ (`vp`) for installing, checking, testing, packing, and invoking project tools.
- Keep public TSDoc, README examples, tests, and `examples/basic.ts` synchronized with behavior.
- Validate changes with the full command sequence documented in `/AGENTS.md`.
