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

variants accepts a direct Record<string, string> for one variant axis. It returns a function whose argument is narrowed to the map's literal keys. Call it with a single key, not an options object.

~~~ts
import { type Variant, variants } from "cn-variants";

const tone = variants({
  primary: "bg-indigo-600 text-white",
  danger: "bg-red-600 text-white",
});

type Tone = Variant<typeof tone>; // "primary" | "danger"
tone("primary");
~~~

Each variants() call models one axis. Create separate functions for tone, size, state, and other axes.

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

- Known variant keys return their class strings unchanged.
- Unknown and inherited keys return an empty string if static types are bypassed.
- variants() copies its input map.
- The returned function exposes a frozen .options snapshot.
- Creating a variant does not freeze, mutate, or retain the caller's map.

## Exported types

- Variant<T>: extracts the allowed key union from a variant function.
- VariantFn<T>: describes a variant lookup and its readonly options.
- VariantOptions: Record<string, string>.
- ClassValue: re-exported from clsx for wrapper functions.

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
