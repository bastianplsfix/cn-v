const body = `# cn-variants API reference

cn-variants is an ESM-only TypeScript package for composing Tailwind CSS class names. Import only from "cn-variants".

## Install

~~~sh
npm install cn-variants
~~~

## cn(...inputs)

cn accepts every ClassValue supported by clsx: strings, arrays, conditional values, and class-name objects. It then resolves conflicting Tailwind utilities with tailwind-merge. Later conflicting utilities win, so caller-provided className values should normally be last.

~~~ts
import { cn } from "cn-variants";

cn("rounded px-2", isActive && "font-bold", "px-4");
~~~

## variants(map)

variants accepts a direct Record<string, string | readonly string[]> for one variant axis. Array values are joined with spaces at lookup time. It returns a function whose argument is narrowed to the map's literal keys; undefined is accepted and returns an empty string. Call it with a single key, not an options object.

~~~ts
import { type Variant, variants } from "cn-variants";

const tone = variants({
  primary: "bg-indigo-600 text-white",
  danger: "bg-red-600 text-white",
});

const size = variants({
  sm: "px-2 py-1",
  lg: ["px-6", "py-3"],
});

type Tone = Variant<typeof tone>; // "primary" | "danger"
tone("primary");
size(undefined); // ""
~~~

Each variants() call models one axis. Create separate functions for tone, size, state, and other axes.

## createCn(mergeClasses)

createCn builds a cn-style function around a custom tailwind-merge implementation, for projects whose Tailwind theme adds custom utilities (design tokens, plugin classes). The default cn stays zero-config. The named createCn export tree-shakes when unused. cn uses that factory internally, so importing cn retains the factory code. Importing only variants still does not pull clsx or tailwind-merge in a bundler.

~~~ts
import { createCn } from "cn-variants";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: { classGroups: { "bg-color": [{ bg: ["primary", "secondary"] }] } },
});

export const cn = createCn(twMerge);
~~~

## Component composition

Defaults belong in component props. Compound styles are ordinary JavaScript conditions. Put className last when consumers should override component defaults.

~~~ts
function buttonClasses({ tone = "primary", size = "md", className }: ButtonProps = {}) {
  return cn(
    "rounded-md font-medium",
    buttonTone(tone),
    buttonSize(size),
    tone === "danger" && size === "lg" && "uppercase",
    className,
  );
}
~~~

## Runtime contract

- Known variant keys return their class strings unchanged; array values are joined with spaces.
- Unknown and inherited keys return an empty string if static types are bypassed; undefined is accepted and returns an empty string.
- Empty-string keys are allowed and behave like any other key, so variants({ "": "hidden" })("") returns "hidden".
- variants() copies its input map into a frozen snapshot; array values are copied and frozen so later mutation of the source does not change lookup or .options.
- The returned function exposes that frozen .options snapshot.
- Creating a variant does not freeze, mutate, or retain the caller's map.

## Exported types

- Variant<T>: extracts the allowed key union from a variant function.
- VariantsOf<T>: extracts the lookup interface from a value created by variants().
- VariantFn<T>: describes a variant lookup and its readonly options.
- VariantOptions: Record<string, VariantValue>.
- VariantValue: string | readonly string[].
- ClassValue: re-exported from clsx for wrapper functions.
- MergeClasses: (classes: string) => string, the merger shape createCn accepts.

## Non-features

cn-variants does not implement default variants, compound-variant configuration, slots, responsive variants, or a CVA-style nested configuration object. Express those requirements in the consuming component or choose a more opinionated variant library.
`;

export const prerender = true;

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
