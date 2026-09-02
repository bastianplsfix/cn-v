import { Badge, badgeTone } from "@cn-variants/ui";
import { createFileRoute } from "@tanstack/react-router";
import { CodePanel, GalleryPage } from "../components/gallery";
import { Knobs, knob, usage, useKnobs } from "../components/knobs";
import { PropsTable, type PropDoc } from "../components/props-table";

const schema = {
  label: knob.text("Badge"),
  tone: knob.select<"primary" | "secondary" | "danger">("secondary", [
    "primary",
    "secondary",
    "danger",
  ]),
};

const propDocs = [
  {
    name: "tone",
    type: "'primary' | 'secondary' | 'danger'",
    defaultValue: '"secondary"',
    note: "Visual variant axis from badgeTone().",
  },
] satisfies PropDoc[];

function formatMap(title: string, options: Record<string, string | readonly string[]>) {
  const body = Object.entries(options)
    .map(([key, value]) => {
      const classes = Array.isArray(value) ? value.join(" ") : String(value);
      return `  ${key}: "${classes}",`;
    })
    .join("\n");
  return `const ${title} = variants({\n${body}\n});`;
}

export const Route = createFileRoute("/badge")({
  component: BadgePage,
});

function BadgePage() {
  const [values, setKnob] = useKnobs(schema);

  return (
    <GalleryPage
      title="Badge"
      description={
        <>
          Label from <code>@cn-variants/ui</code>. Visual style is a single <code>tone</code> axis —
          one <code>variants()</code> lookup, composed with <code>cn</code>, <code>className</code>{" "}
          last.
        </>
      }
      code={usage(
        "Badge",
        [values.tone !== "secondary" && `tone="${values.tone}"`],
        values.label || "Badge",
      )}
      controls={<Knobs schema={schema} values={values} onChange={setKnob} />}
      propDocs={<PropsTable docs={propDocs} />}
      preview={<Badge tone={values.tone}>{values.label || "Badge"}</Badge>}
    >
      <section aria-label="Variant maps" className="flex flex-col gap-3">
        <h2 className="text-[15px] leading-snug text-ink-3">Variant maps</h2>
        <p className="text-[13px] leading-snug text-ink-2">
          Live lookup from <code>badgeTone.options</code>. Defaults stay in the component, not in
          this map.
        </p>
        <CodePanel code={formatMap("badgeTone", badgeTone.options)} />
      </section>
    </GalleryPage>
  );
}
