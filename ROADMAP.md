# cn-variants Roadmap

Planned work and past decisions. Anything not listed under Planned is out of scope until revisited.

## Planned

### `createCn` — custom tailwind-merge configuration

**Decided: add as an opt-in escape hatch in a future minor release.**

tailwind-merge supports custom configs for projects with Tailwind plugins that add new utilities (e.g. `animate-*` from a custom plugin). Currently `cn` hardcodes the default `twMerge`, so those projects have to reimplement `cn` themselves, which defeats the purpose of the library. A factory function lets them pass their own merger:

```ts
import { createCn } from "cn-variants";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      animate: [{ animate: ["fade-in", "slide-up"] }],
    },
  },
});

export const cn = createCn(twMerge);
```

Constraints for the implementation:

- The default `cn` stays zero-config and unchanged.
- `createCn` lives in its own module so it tree-shakes away for everyone who doesn't import it.
- No new concepts beyond "pass your own merge function."

## Resolved

Items below have been decided. Kept here for historical context.

### ~~`.key` / `.option` property on variants~~

**Decided: won't add.** The proposal was a frozen mirror object (`buttonVariant.key.primary`, type `"primary"`) giving type-safe key references in compound conditionals. But TypeScript already checks those string literals whenever props are typed against the variant keys — with `Variant<typeof buttonVariant>` (shipped in v1.1.0) or `keyof typeof buttonVariant.options`, renaming a key errors at every comparison site. The mirror object would add a second frozen allocation per `variants()` call and ~100 bytes of code for safety that already exists. It only helps in untyped contexts, which are not the library's target.

### ~~Re-exporting `ClassValue` from clsx~~

**Shipped in v1.0.0.** `ClassValue` is re-exported from the package entry point as a type-only export.

### ~~Deriving variant unions~~

**Shipped in v1.1.0.** `Variant<typeof fn>` derives the key union directly; `VariantFn` and `VariantOptions` are exported alongside it, and `variants()` uses a `const` generic to preserve literal keys without `as const`.

### ~~Peer dependencies vs direct dependencies~~

**Decided: keep direct dependencies.** cn-variants is a convenience wrapper. Asking users to manually install and version-match two sub-dependencies undermines the "tiny utility" pitch. Deduplication is the bundler's job.

### ~~Tree-shaking~~

**Verified.** `cn` and `variants` are in separate files re-exported through `index.ts`, and the package sets `"sideEffects": false`. Importing only `variants` tree-shakes away `cn` and its dependencies (clsx, tailwind-merge). No subpath export needed.

### ~~Upstream versioning policy~~

**Documented in README as of v1.0.0.** cn-variants pins to the current major of each dependency (clsx `^2`, tailwind-merge `^3`). When an upstream major ships that changes observable behavior, cn-variants will release a new major version.
