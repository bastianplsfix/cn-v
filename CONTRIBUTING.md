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
vp run check:size     # package and minified consumer budgets, including retained peers
vp run test:package   # packed-tarball smoke test (ESM, peers, TS consumer)
```

The package smoke test also bundles each runtime export through the installed
tarball's public entry point. It checks retained peer modules and executes the
result: `variants` retains neither peer, `createCn` retains only `clsx`, and `cn`
retains both. `check:size` uses the same consumer fixtures against the local build
and enforces separate gzip budgets.

For documentation and playground changes:

```bash
vp run docs-check
vp run docs-build
vp exec playwright install chromium
vp run test:ui        # packed UI consumer with no Tailwind, checked in Chromium
```

To work on the playground locally, start it from the repository root with `vp run docs`. The repo-root `cn-variants` library is published; the UI kit and demo apps remain private.

The UI package ships compiled CSS through its component entry point. Rebuild it
with `vp run build:ui` after editing components or styles while the playground is
running. See [the UI package guide](packages/ui/README.md) for styling and build details.

## Shadow DOM demo

Run `vp run demo:shadow` to compare compiled UI styles in document and shadow
roots, without a Tailwind plugin. Validate with `vp run demo:shadow:test`.
See [the demo guide](apps/shadow-demo/README.md) for what the checks prove.

## Committing

Commits should be small and focused. Do not bump the version or edit release tags unless you are cutting a release; releases go through version + CHANGELOG update, a `v<version>` git tag, and push with tags.

## Releasing

1. Update the root package version and refresh the lockfile with `vp install`. The private demos use a local file dependency so they exercise the version being released.
2. Add a `## <version>` entry to `CHANGELOG.md`, including migration guidance for breaking changes. Run the validation commands above.
3. Commit the release changes, then tag that commit with `git tag v<version>` and push the commit and that specific tag.

The Publish workflow checks the tag against the package version and requires release notes before running checks, package validation, consumer tests, and size budgets. It publishes the root package through npm trusted publishing and creates a GitHub Release using the changelog entry. The UI package and demo apps remain private.

## Reporting bugs

Open a GitHub issue with a minimal reproduction. Note that invalid variant keys returning `""` at runtime is intended behavior, not a bug.
