# cn-variants

[![npm version](https://img.shields.io/npm/v/cn-variants.svg)](https://www.npmjs.com/package/cn-variants)
[![CI](https://github.com/bastianplsfix/cn-variants/actions/workflows/ci.yml/badge.svg)](https://github.com/bastianplsfix/cn-variants/actions/workflows/ci.yml)

[Documentation](https://bastianplsfix.github.io/cn-variants/docs/) · [Design decisions](https://bastianplsfix.github.io/cn-variants/docs/#design)

Tiny utilities for working with Tailwind CSS class names. Combines [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) with a typed `variants` helper.

## Install

```bash
npm install cn-variants
```

cn-variants is ESM-only. Use `import` or dynamic `import()`; CommonJS `require()` is not supported.

## API at a glance

```ts
import { cn, type Variant, variants } from "cn-variants";

const buttonTone = variants({
  primary: "bg-indigo-600 text-white",
  danger: "bg-red-600 text-white",
});

const buttonSize = variants({
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
});

type ButtonTone = Variant<typeof buttonTone>;
type ButtonSize = Variant<typeof buttonSize>;

interface ButtonClassOptions {
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
}

function buttonClasses({ tone = "primary", size = "md", className }: ButtonClassOptions = {}) {
  return cn("rounded-md font-medium", buttonTone(tone), buttonSize(size), className);
}
```

The API deliberately differs from CVA-style configuration objects:

- Pass a direct key-to-class map to `variants({ primary: "..." })`.
- Use one `variants()` call for each axis, such as tone or size.
- Call the result with one key, such as `buttonTone("primary")`; it does not accept an options object.
- Put defaults and compound conditions in the component that composes the class strings.
- Put a caller-provided `className` last in `cn()` when it should win Tailwind conflicts.
- Import through the ESM package entry point; internal modules are not public exports.

## When to use this

Use cn-variants when you want the familiar `cn` merge plus a typed lookup for one axis at a time. If you already have shadcn's `cn`, you can keep that merger and still use `variants`. Reach for CVA (`cva()`) or tailwind-variants (`tv()`) when you want a multi-axis configuration object, default variants, `compoundVariants`, or slots. cn-variants does not add those features.

## `cn(...inputs)`

Merges class names using clsx and tailwind-merge. Handles conditionals, duplicates, and Tailwind conflicts.

```ts
import { cn } from "cn-variants";

// Tailwind conflict resolution — last value wins
cn("px-4 py-2", "px-6");
// → "py-2 px-6"

// Conditionals
cn("text-red-500", isActive && "text-blue-500");
// → "text-blue-500" (when isActive is true)

// Object syntax
cn("flex", { "gap-4": hasGap, "items-center": centered });
// → "flex gap-4 items-center" (when both are true)

// Arrays
cn(["rounded-lg", "shadow-md"], "p-4");
// → "rounded-lg shadow-md p-4"

// Mixed — all clsx input types work
cn("base", ["flex", "gap-2"], { "font-bold": isActive }, undefined, null, false);
// → "base flex gap-2 font-bold" (when isActive is true)
```

## `variants(map)`

Creates a typed lookup function for Tailwind class variants. The map is captured with const generics, so object keys stay as string literals for autocomplete and compile-time safety. Values can be a class string or an array of class strings, which are joined with spaces. Returns `""` for unknown keys at runtime, relying on TypeScript for compile-time safety. `undefined` is also accepted and returns `""`, so optional props can be passed straight through:

```ts
import { cn, variants } from "cn-variants";

const buttonTone = variants({
  primary: "bg-indigo-600 text-white border-none",
  secondary: "bg-transparent text-indigo-600 border border-indigo-600",
  danger: "bg-red-600 text-white border-none",
});

const buttonSize = variants({
  sm: "px-3 py-1 text-xs",
  md: ["px-4", "py-2", "text-sm"],
  lg: "px-6 py-3 text-base",
});
```

The returned function accepts only the keys from the map:

```ts
buttonTone("primary");
// ✅ ok

buttonTone("ghost");
// ❌ TypeScript error: expected "primary" | "secondary" | "danger"

buttonTone(undefined);
// ✅ ok — returns ""
```

### Inferring variant types

Use the `Variant` helper type when you need the union for component props:

```ts
import { type Variant, variants } from "cn-variants";

const buttonTone = variants({
  primary: "bg-indigo-600 text-white border-none",
  secondary: "bg-transparent text-indigo-600 border border-indigo-600",
  danger: "bg-red-600 text-white border-none",
});

type ButtonTone = Variant<typeof buttonTone>;
// → "primary" | "secondary" | "danger"
```

The returned function also exposes a frozen `.options` snapshot, so `keyof typeof buttonTone.options` still works if you prefer that style. Creating a variant does not freeze or retain the object passed by the caller. The snapshot includes copied frozen arrays, so later mutation of the source does not change lookup or `.options`.

Empty-string keys are allowed and behave like any other key — they are looked up with the same rules, so `variants({ "": "hidden" })("")` returns `"hidden"`.

### Annotating wrappers with `VariantsOf`

Use the `VariantsOf` helper type when a function parameter should accept any lookup created by `variants()`:

```ts
import { type VariantsOf } from "cn-variants";

function applyStyle(lookup: VariantsOf<typeof buttonSize>, size?: ButtonSize) {
  return cn("font-medium", lookup(size));
}
```

The `VariantValue` type (`string | readonly string[]`) is exported too, in case you type variant maps directly.

### Using variants with `cn` in components

```tsx
type ButtonSize = Variant<typeof buttonSize>;

interface ButtonProps {
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

export function Button({ tone = "primary", size = "md", className, children }: ButtonProps) {
  return (
    <button className={cn("rounded-md font-medium", buttonTone(tone), buttonSize(size), className)}>
      {children}
    </button>
  );
}
```

Callers can override any style through `className` — tailwind-merge ensures the caller's classes win:

```tsx
<Button tone="primary" className="bg-purple-600">
  {/* bg-purple-600 overrides the primary variant's bg-indigo-600 */}
</Button>
```

### Compound variants

For styles that depend on a combination of variants, use conditionals in `cn`:

```tsx
cn(
  "rounded-md font-medium",
  buttonTone(tone),
  buttonSize(size),
  tone === "primary" && size === "lg" && "uppercase tracking-wide",
  tone === "danger" && "ring-2 ring-red-300",
  className,
);
```

### `ClassValue` type

If you write wrapper functions around `cn`, you can import the `ClassValue` type directly:

```ts
import { type ClassValue, cn } from "cn-variants";

function card(...classes: ClassValue[]) {
  return cn("rounded-lg border bg-white shadow-sm", ...classes);
}
```

## Tailwind IntelliSense

To get autocomplete for class strings inside `variants()` and `cn()`, add them to the `classFunctions` setting in your editor's Tailwind CSS configuration.

### VS Code

Install the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension, then add to your `.vscode/settings.json`:

```json
{
  "tailwindCSS.classFunctions": ["cn", "variants"]
}
```

### Zed

Add to your project's `.zed/settings.json`:

```json
{
  "lsp": {
    "tailwindcss-language-server": {
      "settings": {
        "classFunctions": ["cn", "variants"]
      }
    }
  }
}
```

### IntelliJ IDEA / WebStorm

Install the [Tailwind CSS](https://plugins.jetbrains.com/plugin/15321-tailwind-css) plugin, then open **Settings | Languages & Frameworks | Style Sheets | Tailwind CSS**. Add the following language-server option in the **Configuration** area:

```json
{
  "classFunctions": ["cn", "variants"]
}
```

`classFunctions` configures the editor's language server; it is not a `tailwind.config.js` property.

## Philosophy: no mini DSL

cn-variants intentionally keeps compound styles as plain JavaScript expressions instead of adding a `compoundVariants` configuration API. If you can write it as a JavaScript expression, cn-variants should not invent an API for it.

```tsx
cn(
  base(),
  intent(kind),
  sizeVariant(size),
  loading && "opacity-50",
  iconOnly && "aspect-square",
  kind === "primary" && size === "lg" && "uppercase",
);
```

That keeps matching rules, precedence, and debugging in userland where TypeScript and your editor already understand them.

## Bring your own `cn`

`variants` returns plain strings, so it composes with any class-merging function, not just the bundled `cn`. If your app re-renders heavily and class merging shows up in profiles, you can pair `variants` with a faster merger like [cnfast](https://github.com/aidenybai/cnfast) without changing anything else:

```ts
import { cn } from "cnfast";
import { variants } from "cn-variants";

const buttonTone = variants({
  primary: "bg-indigo-600 text-white",
  secondary: "bg-transparent text-indigo-600",
});

cn("rounded-md font-medium", buttonTone("primary"));
```

## Custom Tailwind configurations

`cn` uses tailwind-merge with its default configuration. If your project uses a custom Tailwind theme — for example shadcn/ui tokens like `bg-primary` or custom spacing scales — you may want conflict resolution that understands those utilities. `createCn` is the built-in escape hatch for this.

```ts
import { createCn } from "cn-variants";
import { extendTailwindMerge } from "tailwind-merge";

const cn = createCn(
  extendTailwindMerge({
    extend: {
      classGroups: {
        "font-size": [{ text: ["primary", "secondary"] }],
      },
    },
  }),
);

cn("text-primary", "text-secondary");
// → "text-secondary" (custom tokens are merged correctly)
```

`variants` returns plain strings, so it composes with any merge function unchanged. Wrapping the merger in `createCn` also gives you full clsx input support (`cn("base", { bold: true })`), just like the built-in `cn`.

The named `createCn` export tree-shakes when unused. `cn` is implemented with that factory internally, so importing `cn` retains the factory code. Importing only `variants` still does not pull clsx or tailwind-merge into a bundler. The `MergeClasses` type (`(classes: string) => string`) is exported too, so you can annotate mergers and wrapper functions directly:

```ts
import { type MergeClasses } from "cn-variants";

const merge: MergeClasses = (classes) => myCustomMerger(classes);
```

## React Server Components

`cn` and `variants` are pure, synchronous functions with no module state, side effects, or platform APIs. They work unchanged in React Server Components and any other server environment — no `"use client"` boundary is needed for the library itself.

## Tree-shaking

`cn` and `variants` are independent modules. If you only import `variants`, your bundler will tree-shake away `cn`, `createCn`, and their dependencies (clsx, tailwind-merge), keeping your bundle minimal. The `createCn` named export also tree-shakes when unused; importing `cn` retains the factory because `cn` uses it internally.

The package declares `"sideEffects": false` so bundlers can apply this optimization safely.

## Versioning policy

cn-variants follows [semver](https://semver.org/) and declares `clsx` and `tailwind-merge` as peer dependencies, pinned to their current majors: clsx `^2` and tailwind-merge `^3`. You install and version them alongside cn-variants, so your bundler sees exactly one copy.

- **Patch/minor upstream releases** are absorbed automatically. No action needed on your part.
- **Major upstream releases** may change observable behavior (e.g. how tailwind-merge resolves conflicting utilities). When this happens, cn-variants will release a new major version that bumps the dependency range.

If `cn("px-2", "px-4")` returns a different result because of an upstream update, that's a breaking change from your perspective and will be treated as one.

## Migrating to v3

v3 declares `clsx` and `tailwind-merge` as peer dependencies. npm 7+ and other modern package managers install peers automatically; if yours doesn't, run:

```bash
npm install clsx tailwind-merge
```

Your versions must satisfy clsx `^2` and tailwind-merge `^3`. Nothing else changed for existing code. See the [CHANGELOG](./CHANGELOG.md) for details.

## License

MIT
