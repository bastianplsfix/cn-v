# @cn-variants/ui

React UI kit with Button and Badge components authored with Tailwind.
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
local core tarball. The UI release workflow uses this mode.

## Releasing

The UI package publishes independently from `cn-variants`. The workflow
`.github/workflows/publish-ui.yml` runs on `ui-v*` tags and publishes only
`@cn-variants/ui`. Stable releases use npm's `latest` tag; prereleases use `next`.

### One-time npm setup

You need publish access to the `@cn-variants` npm scope. If the package does not
exist yet, make the initial release from your machine after checking the build:

```sh
vp install
vp exec playwright install chromium
vp run build:ui
node scripts/ui-smoke.mjs --published-core
vp pm login
vp pm publish --filter @cn-variants/ui --access public
```

The `prepublishOnly` hook rebuilds the JavaScript, declarations, and CSS. Once
the package exists, open its npm settings and configure a GitHub Actions trusted
publisher:

- Organization or user: `bastianplsfix`
- Repository: `cn-variants`
- Workflow filename: `publish-ui.yml`
- Environment: leave empty (the workflow does not use a GitHub environment)
- Allow direct publishing with `npm publish`

See [npm's trusted publishing guide](https://docs.npmjs.com/trusted-publishers/).
The workflow uses OIDC and does not need an npm token secret.

### Subsequent releases

1. Set a new version in `packages/ui/package.json` and add a matching
   `## <version>` entry to `packages/ui/CHANGELOG.md`.
2. Run `vp install` to update the lockfile, then validate with `vp run test:ui`.
3. Commit those changes, create `ui-v<version>`, and push the commit and tag.

For example, after setting version `0.0.2`:

```sh
git tag ui-v0.0.2
git push origin HEAD
git push origin ui-v0.0.2
```

Use a new version after the initial manual publish; npm versions cannot be
published twice. Core `v*` tags continue to use the existing core workflow.
