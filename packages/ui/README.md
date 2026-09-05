# @cn-variants/ui

Private workspace kit with Button and Badge components authored with Tailwind.
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
and checks the resulting page in Chromium. The package remains private and is
not published by the core library's release workflow.
