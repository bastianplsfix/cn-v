# Shadow DOM CSS demo

From the repository root:

```sh
vp install
vp run demo:shadow
```

Open http://localhost:5174. This builds the core library and UI package, then
starts the demo on its own port. Stop it with `vp run demo:shadow:stop`.
Rebuild with `vp run build:ui` after editing the UI components or their styles.

## What it demonstrates

The app imports Button and Badge from `@cn-variants/ui`, through the compiled
package entry point. It has no Tailwind dependency, source scanning, or Tailwind
build plugin. Three panels render the same components:

1. Document DOM: the package's automatic CSS import applies.
2. Shadow DOM without package CSS: the document's class selectors cannot reach it.
3. Shadow DOM with package CSS: the exported, compiled stylesheet is attached
   inside the shadow root with a `<style>` element.

Toggle CSS attachment to see the difference, switch the samples to dark mode,
and add conflicting document CSS to verify isolation. Each panel displays actual
computed styles. Buttons remain interactive, including inside the shadow root.

```tsx
import { Button } from "@cn-variants/ui";
import css from "@cn-variants/ui/styles.css?inline";
```

`?inline` is Vite's CSS-as-text import. Other bundlers need their equivalent
loader, or a link to the compiled stylesheet inside the shadow root. Shadow DOM
needs explicit stylesheet placement; a component's document CSS import alone
cannot style a shadow root. The compiled theme includes `:host` defaults.

Custom properties and inherited values can cross the shadow boundary. The demo
sets `data-theme` on a wrapper **inside** each shadow root, so the kit's dark
selectors can match there. It does not claim that selectors on an outside dark
ancestor can cross the boundary.

## Validation

```sh
vp exec playwright install chromium
vp run demo:shadow:test
```

The test builds the production app and verifies it in Chromium: matching computed
styles, CSS removal and reattachment, host-selector isolation, dark mode, focus,
click handling, disabled behavior, and mobile overflow. It then removes all
**document** styles and checks that the shadow sample still renders correctly.
Screenshots are written to the ignored `apps/shadow-demo/dist/` directory.

The separate `vp run test:ui` command tests an installed UI tarball in a temporary
consumer with no Tailwind installed. This demo is a private workspace app and does
not require publishing anything to npm.
