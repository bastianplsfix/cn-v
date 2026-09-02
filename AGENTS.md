# cn-variants project guidance

## Purpose and public contract

cn-variants is a tiny, ESM-only TypeScript library with three runtime exports: `cn`, `createCn`, and `variants`. Preserve these invariants:

- `cn` combines all `clsx` input shapes and resolves Tailwind conflicts with `tailwind-merge`; later conflicting classes win.
- `createCn(mergeClasses)` builds a `cn`-style function around a custom tailwind-merge implementation; it lives in its own module.
- Each `variants()` call represents one variant axis and accepts a direct string-or-string-array map; arrays are joined with spaces.
- `clsx` and `tailwind-merge` are peer dependencies (clsx `^2.1.1`, tailwind-merge `^3.5.0`).
- Keep the `const` generic on `variants()` so keys remain literal types without `as const`.
- Invalid variant keys are TypeScript errors. If types are bypassed, unknown, inherited, or undefined runtime keys return `""`.
- `.options` is a frozen snapshot of a null-prototype object. Never freeze, mutate, or retain the caller's map. Array values are copied and frozen so later mutation of the source does not change lookup or `.options`.
- Defaults and compound variants belong in userland JavaScript, not a new configuration DSL.
- Keep `cn` and `variants` in separate modules so unused functionality and dependencies remain tree-shakeable.
- Preserve the ESM-only export map and `"sideEffects": false` unless a major release explicitly changes that contract.

## Repository map

- `src/cn.ts`: `cn` implementation.
- `src/create-cn.ts`: `createCn` factory; own module for tree-shaking.
- `src/variants.ts`: variant types and runtime implementation.
- `src/index.ts`: public exports only.
- `tests/index.test.ts`: runtime behavior and colocated type assertions.
- `tests/types.ts`: compile-time rejection and inference checks.
- `examples/basic.ts`: canonical consumer usage, compiled against the packed package by the smoke test.
- `scripts/package-smoke.mjs`: validates the published tarball, ESM boundary, peer installation, and consumer TypeScript usage.
- `docs/`: independent Astro 7 documentation site; it requires Node.js 22.12 or newer and has its own lockfile.
- `DESIGN.md`: rationale behind the deliberately small API.
- `ROADMAP.md`: planned work and past decisions; consult before proposing API changes.
- `CONTRIBUTING.md`: human-facing contribution guide and validation steps.

## Change requirements

- Read `DESIGN.md` before expanding the public API.
- Add or update runtime and type tests for observable behavior changes.
- Keep README examples, public TSDoc, and the canonical example aligned with the implementation.
- Use package-root imports in consumer documentation; do not document internal `src` or `dist` paths.
- Treat changes to exports, module format, accepted inputs, return values, or Tailwind conflict behavior as semver-sensitive.

## Validation

After `vp install`, run:

1. `vp check`
2. `vp test run`
3. `vp pack`
4. `vp run check:package`
5. `vp run test:package`

For documentation changes, use the root task aliases:

1. `vp run docs-install`
2. `vp run docs-check`
3. `vp run docs-build`

Start the documentation development server from the repository root with `vp run docs`. Check it
with `vp run docs-status` and stop it with `vp run docs-stop`.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ commands take precedence over `package.json` scripts. If there is a `test` script defined in `scripts` that conflicts with the built-in `vp test` command, run it using `vp run test`.
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.

<!--VITE PLUS END-->

## Releasing

1. Update `version` in `package.json` and add an entry to `CHANGELOG.md`.
2. Commit, tag (`git tag v<version>`), and push with `git push --tags`.
3. The `publish` GitHub Actions workflow handles npm publishing automatically on `v*` tags via npm trusted publishing (OIDC).
