import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CodePanel } from "./gallery";

const samples = {
  install: `npm install cn-variants`,
  glance: `import { cn, type Variant, variants } from "cn-variants";

const buttonTone = variants({
  primary: "bg-indigo-600 text-white",
  danger: "bg-red-600 text-white",
});

const buttonSize = variants({
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
});

type ButtonTone = Variant<typeof buttonTone>;
type ButtonSize = Variant<typeof buttonSize>;

function buttonClasses({
  tone = "primary",
  size = "md",
  className,
}: {
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn("rounded-md font-medium", buttonTone(tone), buttonSize(size), className);
}`,
  cn: `import { cn } from "cn-variants";

// Tailwind conflict resolution — last value wins
cn("px-4 py-2", "px-6");
// → "py-2 px-6"

// Conditionals
cn("text-red-500", isActive && "text-blue-500");

// Object syntax
cn("flex", { "gap-4": hasGap, "items-center": centered });

// Mixed — all clsx input types work
cn("base", ["flex", "gap-2"], { "font-bold": isActive }, undefined, null, false);`,
  variants: `import { type Variant, variants } from "cn-variants";

const buttonTone = variants({
  primary: "bg-indigo-600 text-white border-none",
  secondary: "bg-transparent text-indigo-600 border border-indigo-600",
  danger: "bg-red-600 text-white border-none",
});

const buttonSize = variants({
  sm: "px-3 py-1 text-xs",
  md: ["px-4", "py-2", "text-sm"],
  lg: "px-6 py-3 text-base",
});

type ButtonTone = Variant<typeof buttonTone>;
// → "primary" | "secondary" | "danger"

buttonTone("primary");
buttonTone(undefined); // ""`,
  createCn: `import { createCn } from "cn-variants";
import { extendTailwindMerge } from "tailwind-merge";

const cn = createCn(
  extendTailwindMerge({
    extend: {
      classGroups: {
        "font-size": [{ text: ["caption", "body"] }],
      },
    },
  }),
);

cn("text-caption", "text-red-500");
// → "text-caption text-red-500"`,
  component: `interface ButtonProps {
  tone?: Variant<typeof buttonTone>;
  size?: Variant<typeof buttonSize>;
  className?: string;
}

function buttonClasses({
  tone = "primary",
  size = "md",
  className,
}: ButtonProps = {}) {
  return cn(
    "rounded-md font-medium",
    buttonTone(tone),
    buttonSize(size),
    tone === "danger" && size === "lg" && "uppercase",
    className,
  );
}`,
  intellisense: `{
  "tailwindCSS.classFunctions": ["cn", "variants"]
}`,
  wrapper: `import { type ClassValue, cn } from "cn-variants";

function card(...classes: ClassValue[]) {
  return cn("rounded-lg border bg-white shadow-sm", ...classes);
}`,
};

const toc = [
  { href: "#install", label: "Install" },
  { href: "#when", label: "When to use this" },
  { href: "#cn", label: "cn" },
  { href: "#createcn", label: "createCn" },
  { href: "#variants", label: "variants" },
  { href: "#components", label: "Components" },
  { href: "#button", label: "Button example" },
  { href: "#badge", label: "Badge example" },
  { href: "#intellisense", label: "IntelliSense" },
  { href: "#runtime", label: "Runtime behavior" },
  { href: "#types", label: "Types" },
  { href: "#design", label: "Design decisions" },
] as const;

export function DocsContent() {
  return (
    <>
      <p className="text-[15px] leading-snug text-ink-2">
        Three runtime exports for Tailwind class names: <code>cn</code> merges classes and resolves
        conflicts, <code>variants</code> is a typed lookup for one variant axis, and{" "}
        <code>createCn</code> builds a custom <code>cn</code>. That is the whole API.
      </p>

      <nav aria-label="On this page" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">On this page</h2>
        <ol className="flex flex-col gap-1.5">
          {toc.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-[15px] leading-snug text-ink-2 hover:text-ink">
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="install" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">Install</h2>
        <CodePanel code={samples.install} label="Terminal" />
        <p className="text-[15px] leading-snug text-ink-2">
          cn-variants is ESM-only. Use named <code>import</code> statements or dynamic{" "}
          <code>import()</code>. CommonJS <code>require()</code> is not supported. npm 7+ installs
          the <code>clsx</code> and <code>tailwind-merge</code> peer dependencies automatically.
        </p>
      </section>

      <section id="when" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">When to use this</h2>
        <p className="text-[15px] leading-snug text-ink-2">
          Use cn-variants when you want the familiar <code>cn</code> merge plus a typed lookup for
          one axis at a time. If you already have shadcn&apos;s <code>cn</code>, keep that merger
          and still use <code>variants</code> — it returns plain strings. Reach for CVA (
          <code>cva()</code>) or tailwind-variants (<code>tv()</code>) when you want a multi-axis
          configuration object, default variants, <code>compoundVariants</code>, or slots.
          cn-variants does not add those features.
        </p>
        <CodePanel code={samples.glance} label="button.ts" />
        <p className="text-[15px] leading-snug text-ink-2">
          The API deliberately differs from CVA-style configuration objects:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-[15px] leading-snug text-ink-2">
          <li>
            Pass a direct key-to-class map to <code>{`variants({ primary: "..." })`}</code>.
          </li>
          <li>
            Use one <code>variants()</code> call for each axis, such as tone or size.
          </li>
          <li>
            Call the result with one key, such as <code>buttonTone(&quot;primary&quot;)</code>; it
            does not accept an options object.
          </li>
          <li>
            Put defaults and compound conditions in the component that composes the class strings.
          </li>
          <li>
            Put a caller-provided <code>className</code> last in <code>cn()</code> when it should
            win Tailwind conflicts.
          </li>
        </ul>
      </section>

      <section id="cn" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">
          <code>cn(...inputs)</code>
        </h2>
        <p className="text-[15px] leading-snug text-ink-2">
          <code>cn</code> first combines any value accepted by clsx, then resolves conflicting
          Tailwind utilities with tailwind-merge. Later conflicting utilities win. Put a
          caller-provided <code>className</code> last when consumers should override component
          defaults.
        </p>
        <CodePanel code={samples.cn} label="classes.ts" />
      </section>

      <section id="createcn" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">
          <code>createCn(mergeClasses)</code>
        </h2>
        <p className="text-[15px] leading-snug text-ink-2">
          Projects with custom Tailwind utilities — design tokens like <code>bg-primary</code> or
          plugin classes — can wire a configured tailwind-merge into a <code>cn</code>-style
          function. The default <code>cn</code> stays zero-config. The named <code>createCn</code>{" "}
          export tree-shakes when unused; <code>cn</code> uses that factory internally, so importing{" "}
          <code>cn</code> retains the factory code. Importing only <code>variants</code> still does
          not pull clsx or tailwind-merge in a bundler.
        </p>
        <CodePanel code={samples.createCn} label="cn.ts" />
      </section>

      <section id="variants" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">
          <code>variants(map)</code>
        </h2>
        <p className="text-[15px] leading-snug text-ink-2">
          <code>variants</code> creates a lookup function for one variant axis. The map goes
          directly into the function — there is no nested configuration object. Values can be a
          class string or an array of class strings, joined with spaces.
        </p>
        <CodePanel code={samples.variants} label="variants.ts" />
        <p className="text-[15px] leading-snug text-ink-2">
          Call <code>buttonTone(&quot;primary&quot;)</code>, not{" "}
          <code>{`buttonTone({ tone: "primary" })`}</code>. Use a separate function for each axis.{" "}
          <code>Variant&lt;typeof buttonTone&gt;</code> is the preferred way to derive component
          prop types. <code>keyof typeof buttonTone.options</code> is also supported.
        </p>
      </section>

      <section id="components" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">Composing components</h2>
        <p className="text-[15px] leading-snug text-ink-2">
          Defaults stay with component props. Compound styles stay as boolean expressions inside{" "}
          <code>cn</code>. That keeps control flow visible to TypeScript and your editor.
        </p>
        <CodePanel code={samples.component} label="button.ts" />
      </section>

      <section id="button" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">Button example</h2>
        <p className="text-[15px] leading-snug text-ink-2">
          <Link
            to="/button"
            className="text-ink underline decoration-line-subtle underline-offset-2 hover:decoration-ink"
          >
            Open the Button playground
          </Link>{" "}
          to see a live <code>@cn-variants/ui</code> Button. It uses one <code>variants()</code>{" "}
          call per axis (<code>buttonTone</code>, <code>buttonSize</code>), composes them with{" "}
          <code>cn</code>, and puts <code>className</code> last so callers can override Tailwind
          utilities.
        </p>
      </section>

      <section id="badge" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">Badge example</h2>
        <p className="text-[15px] leading-snug text-ink-2">
          <Link
            to="/badge"
            className="text-ink underline decoration-line-subtle underline-offset-2 hover:decoration-ink"
          >
            Open the Badge playground
          </Link>{" "}
          to see a live <code>@cn-variants/ui</code> Badge. It uses one <code>variants()</code>{" "}
          lookup (<code>badgeTone</code>), composes it with <code>cn</code>, and puts{" "}
          <code>className</code> last so callers can override Tailwind utilities.
        </p>
      </section>

      <section id="intellisense" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">Tailwind IntelliSense</h2>
        <p className="text-[15px] leading-snug text-ink-2">
          Register both function names with the Tailwind CSS language server to enable class
          completion inside calls and variant maps. <code>classFunctions</code> configures the
          editor&apos;s language server; it is not a <code>tailwind.config.js</code> property.
        </p>
        <CodePanel code={samples.intellisense} label=".vscode/settings.json" />
        <p className="text-[15px] leading-snug text-ink-2">
          The same <code>classFunctions</code> setting can be passed through Zed and JetBrains
          Tailwind language-server configuration.
        </p>
      </section>

      <section id="runtime" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">Runtime behavior</h2>
        <ul className="list-disc space-y-2 pl-5 text-[15px] leading-snug text-ink-2">
          <li>
            Known keys return their class string unchanged; array values are joined with spaces.
          </li>
          <li>Unknown or inherited keys return an empty string when static types are bypassed.</li>
          <li>
            <code>undefined</code> is accepted for optional props and returns an empty string.
          </li>
          <li>
            Empty-string keys are allowed and behave like any other key, so{" "}
            <code>{`variants({ "": "hidden" })("")`}</code> returns <code>&quot;hidden&quot;</code>.
          </li>
          <li>
            The source map is copied when <code>variants()</code> is called. Array values are copied
            and frozen, so later mutation of the source does not change lookup or{" "}
            <code>.options</code>.
          </li>
        </ul>
        <p className="text-[15px] leading-snug text-ink-2">
          Invalid keys are styling errors rather than render failures, so the runtime fallback is
          intentionally non-throwing.
        </p>
      </section>

      <section id="types" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">Exported types</h2>
        <table className="w-full table-auto border-collapse text-left align-top">
          <thead>
            <tr>
              <th className="border-b border-line pb-2 pr-3 text-xs leading-none font-normal text-ink-3">
                Type
              </th>
              <th className="border-b border-line pb-2 text-xs leading-none font-normal text-ink-3">
                Purpose
              </th>
            </tr>
          </thead>
          <tbody>
            <TypeRow name="Variant<T>">
              Extract the allowed key union from a variant function.
            </TypeRow>
            <TypeRow name="VariantFn<T>">
              Describe the returned lookup function and its frozen options.
            </TypeRow>
            <TypeRow name="VariantOptions">
              Maps allowed keys for one variant axis to their classes.
            </TypeRow>
            <TypeRow name="VariantValue">
              A class string or a readonly array of class strings.
            </TypeRow>
            <TypeRow name="VariantsOf<T>">
              Extract the lookup interface from a value created by <code>variants()</code>.
            </TypeRow>
            <TypeRow name="ClassValue">
              Type wrapper inputs accepted by <code>cn</code>.
            </TypeRow>
            <TypeRow name="MergeClasses">
              The merger shape accepted by <code>createCn</code>.
            </TypeRow>
          </tbody>
        </table>
        <CodePanel code={samples.wrapper} label="card.ts" />
      </section>

      <section id="migrating-to-v4" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">Migrating to v4</h2>
        <p className="text-[15px] leading-snug text-ink-2">
          Array values are copied and frozen when you call <code>variants()</code> (since 3.0.1).
          Changing a source array later no longer changes the lookup. Arrays and tuples in{" "}
          <code>.options</code> now have matching readonly types in v4. Create a new lookup when
          class definitions change. Existing string maps and immutable array usage need no changes.
        </p>
        <a
          href="https://github.com/bastianplsfix/cn-variants/blob/main/README.md#migrating-to-v4"
          className="text-[15px] text-ink underline underline-offset-4"
        >
          Read the migration guide
        </a>
      </section>

      <section id="design" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">Design decisions</h2>
        <p className="text-[15px] leading-snug text-ink-2">Why the API is the size it is:</p>
        <ol className="flex list-decimal flex-col gap-6 pl-5">
          <Decision title="A function, not a configuration system">
            A lookup function narrows its argument to known keys, works with Tailwind IntelliSense,
            and returns the plain string every class-merging utility already understands.
          </Decision>
          <Decision title="One axis at a time">
            Tone, size, and state stay as separate functions. Components decide how to combine them,
            so there is no named-argument convention or hidden precedence model to learn.
          </Decision>
          <Decision title="Defaults belong to components">
            Prop destructuring already expresses defaults at the boundary where they matter. Moving
            them into a variant definition would create a second source of truth.
          </Decision>
          <Decision title="Compound styles are conditions">
            JavaScript can already say “primary and large.” Keeping the expression in{" "}
            <code>cn()</code> gives TypeScript, refactors, and debuggers the full picture.
          </Decision>
          <Decision title="Invalid runtime keys fail soft">
            TypeScript rejects invalid keys during development. If types are bypassed, an empty
            class string is safer than crashing a render over a styling concern.
          </Decision>
          <Decision title="Options are a snapshot">
            The exposed <code>.options</code> object is a frozen snapshot of the caller&apos;s map,
            including copied frozen arrays. It supports inspection and type extraction without
            taking ownership of user data.
          </Decision>
          <Decision title="Dependencies stay peer dependencies">
            clsx and tailwind-merge are peers so consumers control the versions they use and
            bundlers see exactly one copy of each.
          </Decision>
          <Decision title="Unused code should disappear">
            <code>cn</code>, <code>createCn</code>, and <code>variants</code> live in separate
            modules and the package is marked side-effect free. Importing only the typed lookup does
            not need to retain the class merger.
          </Decision>
        </ol>
      </section>
    </>
  );
}

function TypeRow({ name, children }: { name: string; children: ReactNode }) {
  return (
    <tr className="border-b border-line-subtle last:border-b-0">
      <td className="py-2 pr-3 align-top">
        <code className="font-mono text-xs leading-none text-ink">{name}</code>
      </td>
      <td className="py-2 align-top text-[15px] leading-snug text-ink-2">{children}</td>
    </tr>
  );
}

function Decision({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="flex flex-col gap-2 pl-1 text-[15px] leading-snug text-ink-2">
      <h3 className="text-[15px] leading-snug text-ink">{title}</h3>
      <p>{children}</p>
    </li>
  );
}
