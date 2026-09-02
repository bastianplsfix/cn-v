import { Button, buttonSize, buttonTone } from "@cn-variants/ui";
import { createFileRoute } from "@tanstack/react-router";
import { CodePanel, GalleryPage } from "../components/gallery";
import { Knobs, knob, usage, useKnobs } from "../components/knobs";
import { PropsTable, type PropDoc } from "../components/props-table";

const schema = {
  label: knob.text("Label"),
  tone: knob.select<"primary" | "secondary">("secondary", ["primary", "secondary"]),
  size: knob.select<"sm" | "md">("md", ["sm", "md"]),
  rounded: knob.toggle(),
  iconPosition: knob.select<"none" | "start" | "end">("none", ["none", "start", "end"]),
  disabled: knob.toggle(),
};

const propDocs = [
  {
    name: "tone",
    type: "'primary' | 'secondary'",
    defaultValue: '"secondary"',
    note: "Visual variant axis from buttonTone().",
  },
  {
    name: "size",
    type: "'sm' | 'md'",
    defaultValue: '"md"',
    note: "Size axis from buttonSize().",
  },
  {
    name: "rounded",
    type: "boolean",
    defaultValue: "false",
    note: "Pill shape instead of square.",
  },
  { name: "icon", type: "ReactNode" },
  {
    name: "iconPosition",
    type: "'start' | 'end'",
    defaultValue: '"start"',
    note: "Side of the label the icon renders on.",
  },
  { name: "disabled", type: "boolean", defaultValue: "false" },
] satisfies PropDoc[];

function CircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12" />
    </svg>
  );
}

function formatMap(title: string, options: Record<string, string | readonly string[]>) {
  const body = Object.entries(options)
    .map(([key, value]) => {
      const classes = Array.isArray(value) ? value.join(" ") : String(value);
      return `  ${key}: "${classes}",`;
    })
    .join("\n");
  return `const ${title} = variants({\n${body}\n});`;
}

export const Route = createFileRoute("/button")({
  component: ButtonPage,
});

function ButtonPage() {
  const [values, setKnob] = useKnobs(schema);

  return (
    <GalleryPage
      title="Button"
      description={
        <>
          Base UI Button from <code>@cn-variants/ui</code>. Visual style is a <code>tone</code> axis
          and dimensions are a <code>size</code> axis — each is its own <code>variants()</code>{" "}
          lookup, composed with <code>cn</code>, <code>className</code> last.
        </>
      }
      code={usage(
        "Button",
        [
          values.tone !== "secondary" && `tone="${values.tone}"`,
          values.size !== "md" && `size="${values.size}"`,
          values.rounded && "rounded",
          values.disabled && "disabled",
          values.iconPosition !== "none" &&
            `icon={<CircleIcon />} iconPosition="${values.iconPosition}"`,
        ],
        values.label || "Label",
      )}
      controls={<Knobs schema={schema} values={values} onChange={setKnob} />}
      propDocs={<PropsTable docs={propDocs} />}
      preview={
        <Button
          tone={values.tone}
          size={values.size}
          rounded={values.rounded}
          disabled={values.disabled}
          icon={values.iconPosition === "none" ? undefined : <CircleIcon />}
          iconPosition={values.iconPosition === "none" ? undefined : values.iconPosition}
        >
          {values.label || "Label"}
        </Button>
      }
    >
      <section aria-label="Variant maps" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">Variant maps</h2>
        <p className="text-[13px] leading-snug text-ink-2">
          Live lookups from <code>buttonTone.options</code> and <code>buttonSize.options</code>.
          Defaults and compound styles stay in the component, not in these maps.
        </p>
        <CodePanel
          code={`${formatMap("buttonTone", buttonTone.options)}\n\n${formatMap("buttonSize", buttonSize.options)}`}
        />
      </section>
    </GalleryPage>
  );
}
