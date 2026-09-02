# Contributing to cn-variants

Thanks for your interest in contributing. cn-variants is deliberately tiny, so most contributions are either bug fixes, documentation, or carefully argued API additions.

## Prerequisites

- [Vite+](https://viteplus.dev) (`vp`) must be available globally; it drives the entire toolchain.
- Node.js 20+ (the playground is built in CI with Node 24).

## Setup

```bash
vp install
```

## Workflow

1. Read `DESIGN.md` before proposing any change to the public API. The library intentionally rejects configuration DSLs, default variants, slots, and subpath exports — check the roadmap and design docs before opening a feature PR.
2. Make your change. Keep `cn`, `createCn`, and `variants` in separate modules so unused code tree-shakes.
3. Add or update runtime tests (`tests/index.test.ts`) and type assertions (`tests/types.ts`) for any observable behavior change.
4. Keep `README.md`, `CHANGELOG.md`, TSDoc, `DESIGN.md`, `examples/basic.ts`, and the playground docs page consistent with the implementation.

## Validation

Run all of these before pushing:

```bash
vp check            # format + lint + typecheck
vp test run         # runtime and type tests
vp pack             # build dist/
vp run check:package  # publint + arethetypeswrong
vp run check:size     # gzipped bundle size budget
vp run test:package   # packed-tarball smoke test (ESM, peers, TS consumer)
```

For documentation and playground changes:

```bash
vp run docs-check
vp run docs-build
```

To work on the playground locally, start it from the repository root with `vp run docs`. The published npm package remains the repo-root `cn-variants` library; `apps/playground` and `packages/ui` are private workspace packages.

## Committing

Commits should be small and focused. Do not bump the version or edit release tags unless you are cutting a release; releases go through version + CHANGELOG update, a `v<version>` git tag, and push with tags.

## Reporting bugs

Open a GitHub issue with a minimal reproduction. Note that invalid variant keys returning `""` at runtime is intended behavior, not a bug.
