# @cn-variants/ui

Private demo UI kit with Button and Badge components authored with Tailwind.
The package builds to ESM, TypeScript declarations, and ordinary CSS. Consumers
need React and a bundler that supports CSS imports from dependencies; they do
not need Tailwind, a Tailwind plugin, source scanning, or a separate CSS import.

```tsx
import { Badge, Button } from "@cn-variants/ui";

export function Example() {
  return (
    <>
      <Button tone="primary" size="sm">
        Save
      </Button>
      <Badge tone="danger">Failed</Badge>
    </>
  );
}
```

## Styling

The entry point imports one shared compiled stylesheet automatically. All
built-in variants are included. Tailwind utilities and theme variables use the
`ui` prefix to avoid collisions with the host app. Only the components receive
a reset; the package does not include Tailwind Preflight.

Set `data-theme="dark"` on an ancestor (including `<html>`) to enable dark mode.
The default is light. Customize the `--ui-*` CSS variables, pass `style`, or use
your own CSS class through `className`. Host CSS outside cascade layers takes
precedence over the library's layered styles.

The internal merger understands prefixed classes. For example, `ui:h-7`
overrides a button's default `ui:h-8`. Only utilities used by the kit are shipped;
arbitrary new Tailwind classes need CSS supplied by the consumer. Unprefixed
host classes are preserved, and the normal CSS cascade determines their effect.

## Development

Run from the repository root:

```sh
vp run build:ui
vp run docs
```

Rebuild with `vp run build:ui` after editing the UI package. The playground uses
the compiled package, so its Tailwind configuration does not generate UI styles.
The `styles.css` export remains available for explicit stylesheet access, but
component consumers do not need to import it.

```sh
vp exec playwright install chromium
vp run test:ui
```

The smoke test installs packed UI and core tarballs in a temporary consumer with
no Tailwind dependency, type-checks its imports, builds without a Tailwind plugin,
and checks the resulting page in Chromium. Add `--published-core` when calling
`node scripts/ui-smoke.mjs` to test against npm's core dependency instead of a
local core tarball. This optional mode checks compatibility with the npm dependency.

## Shadow DOM demo

Run `vp run demo:shadow` from the repository root and open http://localhost:5174.
The demo compares document rendering with unstyled and styled shadow roots.
Document CSS imports cannot style elements inside a shadow root. The demo imports
`@cn-variants/ui/styles.css?inline` as compiled CSS text and attaches a `<style>`
element inside the shadow root. There is no Tailwind plugin in the demo app.

The controls include explicit border and outline defaults, so they do not rely
on Tailwind's document-level `@property` registrations inside a shadow root.

Use `vp run demo:shadow:test` for the production browser checks.
The UI kit is private and has no npm publishing workflow.
