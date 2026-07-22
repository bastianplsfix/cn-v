const body = `# cn-variants

> Tiny, typed utilities for composing Tailwind CSS class names. cn-variants combines clsx and tailwind-merge with a typed lookup for variant classes.

cn-variants is ESM-only. Its runtime API has two named exports: cn and variants. It deliberately does not provide defaults, compound-variant configuration, slots, or a component styling DSL.

## Documentation

- [API guide](https://bastianplsfix.github.io/cn-variants/docs/): Installation, cn, variants, exported types, component composition, runtime behavior, and Tailwind IntelliSense.
- [Design decisions](https://bastianplsfix.github.io/cn-variants/design/): Rationale for the small API and the features intentionally left in userland.
- [Full LLM reference](https://bastianplsfix.github.io/cn-variants/llms-full.txt): Plain-text API contract and canonical examples.

## Package and source

- [npm package](https://www.npmjs.com/package/cn-variants): Published package and version history.
- [GitHub repository](https://github.com/bastianplsfix/cn-variants): Source, tests, changelog, and issue tracker.
`;

export const prerender = true;

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
