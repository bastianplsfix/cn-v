# Changelog

## 1.0.0

Initial stable release.

### Features

- `cn(...inputs)` — merge class names with Tailwind conflict resolution (clsx + tailwind-merge)
- `variants(map)` — typed lookup function for variant class maps, with frozen `.options` for deriving union types
- `ClassValue` type re-exported from clsx for typing wrapper functions

### Dependencies

- clsx `^2.1.1`
- tailwind-merge `^3.5.0`
