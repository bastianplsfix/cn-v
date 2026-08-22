const body = `# cn-variants

> Tiny, typed utilities for composing Tailwind CSS class names. cn-variants combines clsx and tailwind-merge with a typed lookup for variant classes.

cn-variants is ESM-only. Its runtime API has three named exports: cn, createCn, and variants. It deliberately does not provide defaults, compound-variant configuration, slots, or a component styling DSL.

## Documentation

- [API guide](https://bastianplsfix.github.io/cn-variants/docs/): Installation, cn, createCn, variants, exported types, component composition, runtime behavior, design decisions, and Tailwind IntelliSense.
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
