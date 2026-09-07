# cn-variants Design Decisions

This document captures the reasoning behind each API choice in cn-variants.

## Why this exists

Every Tailwind component library ends up with two things: a `cn()` function for merging classes, and some pattern for managing variant styles (primary/secondary, sm/md/lg). CVA (`cva()`) and tailwind-variants (`tv()`) solve this, but they bring more API surface than most components use: multi-axis configuration, default variants, compound variants, and (in tailwind-variants) slots. cn-variants is the minimal version: just a typed lookup function on top of the `cn` you already have.

## Why `cn` uses full clsx (not clsx/lite)

clsx/lite only accepts strings and falsy values. No objects, no arrays. It's 99 bytes smaller. We considered it, but cn-variants is a general-purpose utility. Users expect `cn({ "text-red-500": hasError })` to work because that's what clsx does. Shipping a `cn` that silently drops objects would be a footgun. The 99-byte saving isn't worth the confusion.

## Why `variants` is a function, not an object

A plain object (`styles.primary`) works, but gives you no type safety on the lookup key and no Tailwind IntelliSense on the values. Wrapping it in a function lets us:

- Narrow the argument type to `keyof T`, so `buttonTone("nope")` is a compile error
- Register `variants` as a `classFunction` for Tailwind IntelliSense, giving autocomplete inside the object values
- Keep the implementation small enough to read in one sitting

## Why each variant axis is a separate call

We considered a single multi-axis API like CVA's `cva("base", { variants: { color: {...}, size: {...} } })` or tailwind-variants' `tv({ variants: { color: {...}, size: {...} } })`, but it introduces questions: how do you call it? Named args? Positional? How do you type the props? It also requires a custom calling convention that doesn't compose naturally with `cn`.

Separate calls (`buttonTone`, `buttonSize`) are just functions that return strings. They slot into `cn()` like any other class value. The component controls composition and defaults, not the variant system.

## Why there's no default variant

The function requires a key. Defaults belong at the component level:

```tsx
function Button({ tone = "primary" }: ButtonProps) {
```

This is where defaults live in every React component. Moving them into the variant definition would duplicate that responsibility and create a second place to check. A `{ default: "md" }` option was considered and rejected: it redefines what an `undefined` lookup means and splits defaulting between the map and the component.

## Why variant values can be arrays

Class strings for one variant often grow long (`"px-6 py-3 text-base"`). Accepting `string | readonly string[]` lets authors keep classes as list items, which compose better with JavaScript (spread, filter, conditional entries) than string concatenation. Arrays are joined with spaces at lookup time, so the function still returns a plain string that slots into any merger. The `.options` snapshot copies and freezes those arrays, so later mutation of the source does not change lookup or inspection. Its mapped type applies `Readonly` to each value, preserving strings and tuples while exposing mutable input arrays as readonly arrays.

## Why `undefined` is an accepted key

Optional props (`tone?: ButtonTone`) are the norm, so `buttonTone(tone)` should compile without `?? undefined` gymnastics at every call site. It returns `""`, matching unknown keys.

## Why empty-string keys are allowed

`variants({ "": "hidden" })` is a valid axis. Empty-string keys use the same own-key lookup as any other key, so `variants({ "": "hidden" })("")` returns `"hidden"`. There is no special-case exclusion.

## Why `createCn` is a separate factory

Projects with custom Tailwind utilities (font-size tokens like `text-caption`, plugin classes) need a configured tailwind-merge; the default `cn` must stay zero-config. Rather than making `cn` configurable — which taxes everyone for one edge case — `createCn(mergeClasses)` builds a clsx-wired merge function from any tailwind-merge implementation. The named `createCn` export tree-shakes when unused. `cn` uses that factory internally, so importing `cn` retains the factory code. Importing only `variants` still does not pull clsx or tailwind-merge in a bundler.

## Why invalid keys return `""` instead of throwing

TypeScript catches invalid keys at compile time. The only way to hit the runtime path with a bad key is to bypass types (casting, untyped JS, dynamic data). In that case, throwing crashes the render for a styling concern, which is disproportionate. CVA and clsx both silently ignore invalid inputs. We follow the same pattern: return `""`, `cn` filters it out, the component renders without that variant's classes. Visually wrong is better than broken.

## Why `Variant<typeof fn>` exists

Type extraction should be obvious enough that users almost never write conditional types or reach into function parameters themselves:

```ts
type ButtonTone = Variant<typeof buttonTone>;
```

The helper is type-only and adds no runtime code. It also keeps examples focused on component props instead of teaching `keyof typeof` patterns.

## Why `VariantsOf<T>` exists alongside `VariantFn`

`VariantFn<TOptions>` is exported and can be written directly when the options type is known up front (`VariantFn<{ sm: string }>`). `VariantsOf<T>` covers the other direction: extracting the lookup interface from an existing variants function without restating its options, so wrapper functions stay in sync automatically:

```ts
function applyStyle(lookup: VariantsOf<typeof buttonTone>) {}
```

It distributes over its input, so unions of variant functions map to unions of lookups. Both are type-only; keeping them separate avoids making `VariantFn` do double duty as both a constructor annotation and an inference helper.

## Why `.options` exists

`.options` is a frozen snapshot of the original map, including copied frozen arrays. It remains useful as a runtime reference to the available values and as an alternate type extraction surface for users who prefer built-in TypeScript syntax, without freezing or retaining the caller's object:

```ts
type ButtonTone = keyof typeof buttonTone.options;
```

It was originally called `.map`, but that collides mentally with `Array.map()` and the `Map` constructor. `.options` reads naturally: "the options of buttonTone."

## Why `variants` uses const generics

Variant keys should stay literal without requiring users to add `as const` or write explicit types. The function uses a const generic so this:

```ts
const color = variants({
  primary: "...",
  secondary: "...",
});
```

infers the call signature as accepting `"primary" | "secondary"`, not `string`. That preserves autocomplete at the call site and produces clearer TypeScript errors for invalid values.

## Why compound variants are just conditionals

CVA has a `compoundVariants` array for "when primary AND lg, apply X." We handle it with a conditional in `cn`:

```tsx
cn(
  buttonTone(tone),
  buttonSize(size),
  tone === "primary" && size === "lg" && "uppercase tracking-wide",
);
```

This is plain JavaScript. No new API to learn. For one or two compound cases it's clear and direct. If a component accumulates many compound conditions, that's a signal to reconsider the variant design or reach for a more opinionated tool.

## Why there are no subpath exports

The package exposes a single entry point even though `cn` and `variants` (and `createCn`) live in separate modules. Subpath exports like `cn-variants/variants` were considered to let variants-only consumers skip clsx and tailwind-merge entirely. They were rejected: with `"sideEffects": false` and per-module files, bundlers already tree-shake unused exports, so subpaths only change install-time weight — and since v3 the dependencies are peers that npm installs automatically anyway. The single entry point keeps the export map, type checking, and documentation simple. Revisit only if peer auto-installation proves costly in practice.

## Why `classFunctions` over `classRegex`

The Tailwind CSS language server supports two ways to detect class strings in custom functions:

- `classRegex` (experimental): fragile regex patterns like `["variants\\(([^)]*)\\)", "\"([^\"]*)\""]` that parse source code with regular expressions. Breaks on nested parentheses, formatting changes, or comments.
- `classFunctions` (stable): just a list of function names: `["cn", "variants"]`. The language server handles the rest.

We use `classFunctions`. It's simpler to configure, not experimental, and works across VS Code, Zed, and IntelliJ through their Tailwind language-server settings. It is an editor setting, not a property in `tailwind.config.js`.
