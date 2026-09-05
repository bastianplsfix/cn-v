import { useLayoutEffect, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { Badge, Button } from "@cn-variants/ui";
import compiledCss from "@cn-variants/ui/styles.css?inline";
import "./styles.css";

// Layout and readout only. This CSS deliberately does not style UI components.
const frameCss = `
  .specimen { padding: 24px; min-height: 270px; color: #192d2a; background: #fff; font: 14px/1.5 system-ui, sans-serif; }
  .specimen[data-theme="dark"] { background: #182322; color: #e6efed; }
  .sample-row { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; min-height: 48px; }
  .sample-status { min-height: 24px; margin: 14px 0 20px; font-size: 12px; }
  .readout { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 0; border-top: 1px solid #869e9940; padding-top: 16px; }
  .readout dt { opacity: .65; font-size: 11px; }
  .readout dd { margin: 2px 0 0; font: 12px ui-monospace, monospace; overflow-wrap: anywhere; }
`;

function Specimen({ theme, revision }: { theme: string; revision: string }) {
  const [button, setButton] = useState<HTMLElement | null>(null);
  const [clicks, setClicks] = useState(0);
  const [computed, setComputed] = useState<Record<string, string>>({});
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!button) return;
      const style = getComputedStyle(button);
      setComputed({
        Display: style.display,
        Height: style.height,
        Padding: style.paddingInlineStart,
        Border: `${style.borderTopWidth} ${style.borderTopStyle}`,
        Background: style.backgroundColor,
        Font: style.fontSize,
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [button, revision, theme]);
  return (
    <div className="specimen" data-theme={theme}>
      <div className="sample-row">
        <Button
          ref={setButton}
          data-sample="primary"
          tone="primary"
          onClick={() => setClicks((value) => value + 1)}
        >
          Click me
        </Button>
        <Badge tone="danger">Badge</Badge>
      </div>
      <div className="sample-row">
        <Button size="sm">Small</Button>
        <Button disabled>Disabled</Button>
      </div>
      <p className="sample-status" aria-live="polite">
        {clicks === 0
          ? "Try a button. React events work inside the shadow root."
          : `Clicked ${clicks} ${clicks === 1 ? "time" : "times"}.`}
      </p>
      <dl className="readout" aria-label="Computed button styles">
        {Object.entries(computed).map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd data-property={key.toLowerCase()}>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ShadowFrame({
  id,
  withCss,
  children,
}: {
  id: string;
  withCss: boolean;
  children: ReactNode;
}) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [shadow, setShadow] = useState<ShadowRoot | null>(null);
  useLayoutEffect(() => {
    if (host) setShadow(host.shadowRoot ?? host.attachShadow({ mode: "open" }));
  }, [host]);
  return (
    <div id={id} ref={setHost} className="shadow-host">
      {shadow &&
        createPortal(
          <>
            {withCss && <style data-ui-css>{compiledCss}</style>}
            <style>{frameCss}</style>
            {children}
          </>,
          shadow,
        )}
    </div>
  );
}

function App() {
  const [withCss, setWithCss] = useState(true);
  const [dark, setDark] = useState(false);
  const [interference, setInterference] = useState(false);
  const theme = dark ? "dark" : "light";
  const revision = `${withCss}-${interference}`;
  return (
    <main className={interference ? "interference" : undefined}>
      <header className="page-heading">
        <span className="eyebrow">CN-VARIANTS / CSS LAB</span>
        <h1>
          Same components.
          <br />
          <span>Different boundaries.</span>
        </h1>
        <p>
          A real consumer app with no Tailwind dependency or build plugin. The components and
          stylesheet come from the built UI package.
        </p>
      </header>
      <div className="controls" aria-label="Demo controls">
        <label>
          <input
            type="checkbox"
            checked={withCss}
            onChange={(event) => setWithCss(event.target.checked)}
          />{" "}
          Attach compiled CSS to shadow root
        </label>
        <label>
          <input
            type="checkbox"
            checked={dark}
            onChange={(event) => setDark(event.target.checked)}
          />{" "}
          Dark samples
        </label>
        <label>
          <input
            type="checkbox"
            checked={interference}
            onChange={(event) => setInterference(event.target.checked)}
          />{" "}
          Add conflicting document CSS
        </label>
      </div>
      <div className="comparison">
        <section className="demo-case" id="document-demo">
          <header>
            <span className="case-number">01 / DOCUMENT</span>
            <h2>Automatic CSS import</h2>
            <p>The component import loads CSS into the document.</p>
          </header>
          <style>{frameCss}</style>
          <Specimen theme={theme} revision={revision} />
        </section>
        <section className="demo-case">
          <header>
            <span className="case-number">02 / SHADOW DOM</span>
            <h2>No stylesheet attached</h2>
            <p>Document styles stop at the shadow boundary.</p>
          </header>
          <ShadowFrame id="unstyled-shadow" withCss={false}>
            <Specimen theme={theme} revision={revision} />
          </ShadowFrame>
        </section>
        <section className="demo-case">
          <header>
            <span className="case-number">03 / SHADOW DOM</span>
            <h2>Compiled CSS attached</h2>
            <p>
              {withCss
                ? "The same shipped CSS, placed inside the shadow root."
                : "CSS is off. Turn it back on to restore the styles."}
            </p>
          </header>
          <ShadowFrame id="styled-shadow" withCss={withCss}>
            <Specimen theme={theme} revision={revision} />
          </ShadowFrame>
        </section>
      </div>
      <section className="explanation">
        <div>
          <h2>Compiled once. Scoped where you need it.</h2>
          <p>
            A normal component import cannot automatically style every shadow root. This demo uses
            Vite’s <code>?inline</code> import to read the exported stylesheet as text, then inserts
            it into the shadow root.
          </p>
          <p>
            Only the frame and this readout use demo CSS. The buttons and badges use the package’s
            compiled CSS. Custom properties and inherited values can still cross a shadow boundary;
            ordinary document selectors cannot.
          </p>
          <p className="asset-note">
            Loaded stylesheet: {new TextEncoder().encode(compiledCss).length.toLocaleString()} bytes
            of compiled CSS.
          </p>
        </div>
        <pre>
          <code>{`import { Button } from "@cn-variants/ui";
import css from "@cn-variants/ui/styles.css?inline";

const shadow = host.attachShadow({ mode: "open" });
const style = document.createElement("style");
style.textContent = css;
shadow.append(style);

// Mount your React components in this shadow root.`}</code>
        </pre>
      </section>
    </main>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
