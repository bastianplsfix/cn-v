# cn-variants Roadmap

Planned work and past decisions. Anything not listed under Planned is out of scope until revisited.

## Resolved

Items below have been decided. Kept here for historical context.

### ~~Default variant support~~

**Decided: won't add.** Defaults belong at the component level (`tone = "primary"` in props), where every React component already puts them; a `{ default: "md" }` option would create a second place to check and redefine what an `undefined` lookup means. DESIGN.md's "Why there's no default variant" covers the reasoning.

### ~~`createCn` — custom tailwind-merge configuration~~

**Shipped.** `createCn(mergeClasses)` builds a `cn`-style function around a custom tailwind-merge implementation (e.g. from `extendTailwindMerge`). It lives in its own module so it tree-shakes away for consumers who don't import it.

### ~~Peer dependencies vs direct dependencies~~

**Decided: switch to peer dependencies.** Reverses the earlier decision to keep direct dependencies: `clsx` and `tailwind-merge` are now declared as peer dependencies so consumers don't bundle duplicates. This requires a major version bump since consumers must install them explicitly.

### ~~Multi-value maps~~

**Shipped.** Variant values accept `string | readonly string[]`; arrays are joined with spaces at lookup time.
