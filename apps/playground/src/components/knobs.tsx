import { useCallback, useState } from "react";
import { Input, Select, Switch } from "#/components/ui";

export type TextKnobDef = { type: "text"; initial: string; placeholder?: string };
export type NumberKnobDef = { type: "number"; initial: number; min?: number; max?: number };
export type SelectKnobDef<T extends string> = {
  type: "select";
  initial: T;
  options: readonly T[];
};
export type ToggleKnobDef = { type: "toggle"; initial: boolean };

export type KnobDef<T = unknown> =
  | TextKnobDef
  | NumberKnobDef
  | SelectKnobDef<T & string>
  | ToggleKnobDef;

export const knob = {
  text: (initial: string, placeholder?: string): TextKnobDef => ({
    type: "text",
    initial,
    placeholder,
  }),
  number: (initial: number, range?: { min?: number; max?: number }): NumberKnobDef => ({
    type: "number",
    initial,
    ...range,
  }),
  select: <T extends string>(initial: T, options: readonly T[]): SelectKnobDef<T> => ({
    type: "select",
    initial,
    options,
  }),
  toggle: (initial = false): ToggleKnobDef => ({ type: "toggle", initial }),
};

type InferValue<D> = D extends { type: "toggle" }
  ? boolean
  : D extends { type: "number" }
    ? number
    : D extends { type: "select"; options: readonly (infer T)[] }
      ? T
      : D extends { type: "text" }
        ? string
        : never;

export type InferValues<K extends Record<string, KnobDef>> = {
  [P in keyof K]: InferValue<K[P]>;
};

export type SetKnob<K extends Record<string, KnobDef>> = ReturnType<typeof useKnobs<K>>[1];

export function useKnobs<K extends Record<string, KnobDef>>(defs: K) {
  const [values, setValues] = useState(() => {
    const initial = {} as Record<keyof K, unknown>;
    for (const key of Object.keys(defs) as Array<keyof K>) {
      initial[key] = defs[key]!.initial;
    }
    return initial as InferValues<K>;
  });

  const set = useCallback(<Key extends keyof K & string>(key: Key, value: InferValue<K[Key]>) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  }, []);

  return [values, set] as const;
}

/**
 * Formats a JSX usage snippet. Falsy attrs are dropped; the result
 * collapses to a self-closing tag when there are no attrs or children,
 * and breaks into multiple lines when there are children.
 */
export function usage(
  tag: string,
  attrs: Array<string | false | null | undefined> = [],
  children?: string,
): string {
  const present = attrs.filter(
    (attr): attr is string => typeof attr === "string" && attr.length > 0,
  );
  if (children) {
    return present.length > 0
      ? `<${tag} ${present.join(" ")}>\n  ${children}\n</${tag}>`
      : `<${tag}>\n  ${children}\n</${tag}>`;
  }
  return present.length > 0 ? `<${tag} ${present.join(" ")} />` : `<${tag} />`;
}

const rowClasses = "flex items-center justify-between gap-3";
const labelClasses = "knob-label text-[13px] leading-snug text-ink-3";
const controlClasses = "w-44";

type AnySchema = Record<
  string,
  TextKnobDef | NumberKnobDef | SelectKnobDef<string> | ToggleKnobDef
>;

export function Knobs<K extends Record<string, KnobDef>>({
  schema,
  values,
  onChange,
  idPrefix = "knob",
}: {
  schema: K;
  values: InferValues<K>;
  onChange: <Key extends keyof K & string>(key: Key, value: InferValue<K[Key]>) => void;
  idPrefix?: string;
}) {
  return (
    <KnobsRows
      idPrefix={idPrefix}
      schema={schema as AnySchema}
      values={values as Record<string, string | number | boolean>}
      onChange={onChange as (key: string, value: unknown) => void}
    />
  );
}

function KnobsRows({
  idPrefix,
  schema,
  values,
  onChange,
}: {
  idPrefix: string;
  schema: AnySchema;
  values: Record<string, string | number | boolean>;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {(Object.keys(schema) as string[]).map((key) => {
        const def = schema[key]!;
        const value = values[key];
        const id = `${idPrefix}-${key}`;

        switch (def.type) {
          case "text":
            return (
              <div key={key} className={rowClasses}>
                <label htmlFor={id} className={labelClasses}>
                  {key}
                </label>
                <Input
                  id={id}
                  type="text"
                  value={String(value ?? "")}
                  placeholder={def.placeholder}
                  onChange={(event) => onChange(key, event.target.value)}
                  className={controlClasses}
                />
              </div>
            );
          case "number":
            return (
              <div key={key} className={rowClasses}>
                <label htmlFor={id} className={labelClasses}>
                  {key}
                </label>
                <Input
                  id={id}
                  type="number"
                  value={Number(value ?? 0)}
                  min={def.min}
                  max={def.max}
                  onChange={(event) => onChange(key, Number(event.target.value))}
                  className={controlClasses}
                />
              </div>
            );
          case "select":
            return (
              <div key={key} className={rowClasses}>
                <span className={labelClasses}>{key}</span>
                <Select.Root
                  value={String(value)}
                  onValueChange={(nextValue) => onChange(key, nextValue)}
                >
                  <Select.Trigger aria-label={key} className={`${controlClasses} min-w-0`}>
                    <Select.Value />
                    <Select.Icon>▾</Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Positioner sideOffset={4} alignItemWithTrigger={false}>
                      <Select.Popup>
                        <Select.List>
                          {def.options.map((option) => (
                            <Select.Item key={option} value={option}>
                              <Select.ItemIndicator className="col-start-1">✓</Select.ItemIndicator>
                              <Select.ItemText className="col-start-2">{option}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.List>
                      </Select.Popup>
                    </Select.Positioner>
                  </Select.Portal>
                </Select.Root>
              </div>
            );
          case "toggle":
            return (
              <div key={key} className={rowClasses}>
                <span className={labelClasses}>{key}</span>
                <Switch.Root
                  checked={Boolean(value)}
                  onCheckedChange={(nextChecked) => onChange(key, nextChecked)}
                  aria-label={key}
                >
                  <Switch.Thumb />
                </Switch.Root>
              </div>
            );
        }
      })}
    </div>
  );
}
