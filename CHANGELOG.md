# Changelog

## Unreleased

### Breaking

- Declare `clsx` and `tailwind-merge` as peer dependencies instead of direct dependencies; consumers must install them explicitly
- The key parameter of functions returned by `variants()` now also accepts `undefined` (returns an empty string), widening the call signature

### Features

- Variant map values accept `string | readonly string[]`; arrays are joined with spaces at lookup time
- `createCn(mergeClasses)` builds a `cn`-style function around a custom tailwind-merge implementation, for projects with custom Tailwind utilities; it lives in its own module and tree-shakes away unless imported
- `VariantsOf<T>` helper type extracts the lookup interface from a value created by `variants()`
- `VariantValue` type (`string | readonly string[]`) is exported

### Documentation

- Documented empty-string keys and the read-only (non-frozen) array values inside `.options`
- Documented React Server Components compatibility
- Documented the peer dependency model in the versioning policy
- Synced the documentation site and LLM reference files with the new API surface

## 2.0.0

### Breaking

- Make the package export explicitly ESM-only; CommonJS `require()` no longer resolves the entry point

### Fixed

- Return an empty string for inherited object property names passed as unknown variant keys
- Expose a frozen snapshot through `.options` without freezing or retaining the caller's object

### Changed

- Declare the package as side-effect free
- Add type-level and package compatibility checks
- Test the packed package against Node.js 20, 22, and 24
- Upgrade and pin the Vite+ toolchain
- Use stable TypeScript declaration generation
- Make CI and publishing reproducible through the Vite+ workflow
- Pin GitHub Actions and automate dependency updates

## 1.1.0

### Features

- `Variant<typeof fn>` helper type for deriving the variant key union, plus exported `VariantFn` and `VariantOptions` types
- `variants(map)` now uses a `const` generic, preserving literal keys for autocomplete and clearer type errors without `as const`

### Documentation

- Documented the no-mini-DSL philosophy (compound variants stay plain JavaScript conditionals)
- Documented pairing `variants` with alternative `cn` implementations such as cnfast

## 1.0.0

Initial stable release.

### Features

- `cn(...inputs)` — merge class names with Tailwind conflict resolution (clsx + tailwind-merge)
- `variants(map)` — typed lookup function for variant class maps, with frozen `.options` for deriving union types
- `ClassValue` type re-exported from clsx for typing wrapper functions

### Dependencies

- clsx `^2.1.1`
- tailwind-merge `^3.5.0`
