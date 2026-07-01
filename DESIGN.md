# cn-variants Design Decisions

This document captures the reasoning behind each API choice in cn-variants.

## Why this exists

Every Tailwind component library ends up with two things: a `cn()` function for merging classes, and some pattern for managing variant styles (primary/secondary, sm/md/lg). Libraries like CVA and tailwind-variants solve this, but they bring a lot of API surface (compound variants, slots, responsive variants, default variants) that most components never use. cn-variants is the minimal version: just a typed lookup function on top of the `cn` you already have.

## Why `cn` uses full clsx (not clsx/lite)

clsx/lite only accepts strings and falsy values. No objects, no arrays. It's 99 bytes smaller. We considered it, but cn-variants is a general-purpose utility. Users expect `cn({ "text-red-500": hasError })` to work because that's what clsx does. Shipping a `cn` that silently drops objects would be a footgun. The 99-byte saving isn't worth the confusion.

## Why `variants` is a function, not an object

A plain object (`styles.primary`) works, but gives you no type safety on the lookup key and no Tailwind IntelliSense on the values. Wrapping it in a function lets us:

- Narrow the argument type to `keyof T`, so `buttonVariant("nope")` is a compile error
- Register `variants` as a `classFunction` for Tailwind IntelliSense, giving autocomplete inside the object values
- Keep the implementation to 4 lines

## Why each variant axis is a separate call

We considered a single multi-axis API like CVA's `tv({ variants: { color: {...}, size: {...} } })`, but it introduces questions: how do you call it? Named args? Positional? How do you type the props? It also requires a custom calling convention that doesn't compose naturally with `cn`.

Separate calls (`buttonVariant`, `buttonSize`) are just functions that return strings. They slot into `cn()` like any other class value. The component controls composition and defaults, not the variant system.

## Why there's no default variant

The function requires a key. Defaults belong at the component level:

```tsx
function Button({ variant = "primary" }: ButtonProps) {
```

This is where defaults live in every React component. Moving them into the variant definition would duplicate that responsibility and create a second place to check.

## Why invalid keys return `""` instead of throwing

TypeScript catches invalid keys at compile time. The only way to hit the runtime path with a bad key is to bypass types (casting, untyped JS, dynamic data). In that case, throwing crashes the render for a styling concern, which is disproportionate. CVA and clsx both silently ignore invalid inputs. We follow the same pattern: return `""`, `cn` filters it out, the component renders without that variant's classes. Visually wrong is better than broken.

## Why `Variant<typeof fn>` exists

Type extraction should be obvious enough that users almost never write conditional types or reach into function parameters themselves:

```ts
type ButtonVariant = Variant<typeof buttonVariant>;
```

The helper is type-only and adds no runtime code. It also keeps examples focused on component props instead of teaching `keyof typeof` patterns.

## Why `.options` exists

`.options` is a frozen copy of the original map. It remains useful as a runtime reference to the available values and as an alternate type extraction surface for users who prefer built-in TypeScript syntax:

```ts
type ButtonVariant = keyof typeof buttonVariant.options;
```

It was originally called `.map`, but that collides mentally with `Array.map()` and the `Map` constructor. `.options` reads naturally: "the options of buttonVariant."

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
  buttonVariant(variant),
  buttonSize(size),
  variant === "primary" && size === "lg" && "uppercase tracking-wide",
);
```

This is plain JavaScript. No new API to learn. For one or two compound cases it's clear and direct. If a component accumulates many compound conditions, that's a signal to reconsider the variant design or reach for a more opinionated tool.

## Why `classFunctions` over `classRegex`

The Tailwind CSS language server supports two ways to detect class strings in custom functions:

- `classRegex` (experimental): fragile regex patterns like `["variants\\(([^)]*)\\)", "\"([^\"]*)\""]` that parse source code with regular expressions. Breaks on nested parentheses, formatting changes, or comments.
- `classFunctions` (stable): just a list of function names: `["cn", "variants"]`. The language server handles the rest.

We use `classFunctions`. It's simpler to configure, not experimental, and works across VS Code, Zed, and IntelliJ.
