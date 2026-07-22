# Changelog

## Unreleased

### Fixed

- Return an empty string for inherited object property names passed as unknown variant keys
- Expose a frozen snapshot through `.options` without freezing or retaining the caller's object

### Changed

- Declare the package as explicitly ESM-only and side-effect free
- Add type-level and package compatibility checks
- Upgrade and pin the Vite+ toolchain
- Make CI and publishing reproducible through the Vite+ workflow

## 1.0.0

Initial stable release.

### Features

- `cn(...inputs)` — merge class names with Tailwind conflict resolution (clsx + tailwind-merge)
- `variants(map)` — typed lookup function for variant class maps, with frozen `.options` for deriving union types
- `ClassValue` type re-exported from clsx for typing wrapper functions

### Dependencies

- clsx `^2.1.1`
- tailwind-merge `^3.5.0`
