import { expect, expectTypeOf, test } from "vite-plus/test";
import type { ClassValue } from "clsx";
import { cn } from "../src/cn.ts";
import { createCn, type MergeClasses } from "../src/create-cn.ts";
import { type Variant, type VariantFn, type VariantsOf, variants } from "../src/variants.ts";

// cn

test("cn merges class names", () => {
  expect(cn("foo", "bar")).toBe("foo bar");
});

test("cn handles conditionals", () => {
  const showBar = false;
  expect(cn("foo", showBar && "bar", "baz")).toBe("foo baz");
});

test("cn merges tailwind conflicts", () => {
  expect(cn("px-2", "px-4")).toBe("px-4");
});

test("cn returns empty string for no arguments", () => {
  expect(cn()).toBe("");
});

test("cn ignores undefined and null", () => {
  expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
});

test("cn supports object syntax", () => {
  expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
});

test("cn supports array syntax", () => {
  expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
});

test("cn deduplicates identical tailwind classes", () => {
  expect(cn("flex", "flex")).toBe("flex");
});

test("cn resolves tailwind color conflicts", () => {
  expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
});

test("cn handles mixed argument types", () => {
  const isActive = true;
  expect(cn("base", ["flex", "gap-2"], { "font-bold": isActive }, undefined)).toBe(
    "base flex gap-2 font-bold",
  );
});

// createCn

test("createCn applies clsx then the provided merger", () => {
  const merger: MergeClasses = (classes) => classes;
  const customCn = createCn(merger);
  expectTypeOf(customCn).toEqualTypeOf<typeof cn>();
  expectTypeOf(customCn).parameter(0).toEqualTypeOf<ClassValue>();
  expectTypeOf(customCn("a")).toEqualTypeOf<string>();
  expect(customCn()).toBe("");
  expect(customCn("base", ["flex", undefined], { bold: true }, false, null)).toBe("base flex bold");
});

test("createCn uses the provided merger", () => {
  const customCn = createCn(() => "merged");
  expect(customCn("px-2", "px-4")).toBe("merged");
});

test("createCn works with a real extendTailwindMerge merger", async () => {
  const { extendTailwindMerge } = await import("tailwind-merge");
  const twMerge = extendTailwindMerge({
    extend: {
      classGroups: {
        "font-size": [{ text: ["caption", "body"] }],
      },
    },
  });
  const customCn = createCn(twMerge);
  // The default merger interprets text-caption as a color, not a font size.
  expect(cn("text-caption", "text-red-500")).toBe("text-red-500");
  expect(customCn("text-caption", "text-red-500")).toBe("text-caption text-red-500");
  expect(customCn("text-caption text-red-500", "text-body")).toBe("text-red-500 text-body");
});

// variants

test("variants returns matching class string", () => {
  const size = variants({ sm: "text-sm", lg: "text-lg" });
  expect(size("sm")).toBe("text-sm");
  expect(size("lg")).toBe("text-lg");
});

test("variants returns empty string for unknown key", () => {
  const size = variants({ sm: "text-sm" });
  // @ts-expect-error testing unknown key at runtime
  expect(size("xl")).toBe("");
});

test("variants returns empty string for numeric and symbol keys", () => {
  const size = variants({ sm: "text-sm" });
  // @ts-expect-error testing invalid key at runtime
  expect(size(0)).toBe("");
  const symbol = Symbol("sm");
  const lookup = size as (key: string | number | symbol) => string;
  expect(lookup(symbol)).toBe("");
});

test("variants joins array values with spaces", () => {
  const size = variants({ sm: ["px-2", "py-1"], lg: "px-6 py-3" });
  expect(size("sm")).toBe("px-2 py-1");
  expect(size("lg")).toBe("px-6 py-3");
});

test("variants returns empty string for undefined key", () => {
  const size = variants({ sm: "text-sm" });
  expect(size(undefined)).toBe("");
});

test("variants ignores inherited object properties", () => {
  const size = variants({ sm: "text-sm" });
  const lookup = size as (key: string) => string;
  for (const key of [
    "toString",
    "constructor",
    "__proto__",
    "valueOf",
    "hasOwnProperty",
    "propertyIsEnumerable",
    "toLocaleString",
    "isPrototypeOf",
    "__defineGetter__",
  ]) {
    expect(lookup(key)).toBe("");
  }
});

test("variants exposes frozen options", () => {
  const source = { sm: "text-sm", lg: "text-lg" };
  const size = variants(source);
  expect(size.options).toEqual({ sm: "text-sm", lg: "text-lg" });
  expect(Object.isFrozen(size.options)).toBe(true);
  expect(size.options).not.toBe(source);
  expect(Object.isFrozen(source)).toBe(false);

  source.sm = "text-base";
  expect(size("sm")).toBe("text-sm");
});

test("variants options snapshot has a null prototype", () => {
  const size = variants({ sm: "text-sm" });
  expect(Object.getPrototypeOf(size.options)).toBeNull();
});

test("options snapshot copies and freezes array values", () => {
  const source = { sm: ["px-2", "py-1"] as string[] };
  const size = variants(source);
  expect(size.options.sm).toEqual(["px-2", "py-1"]);
  expect(size.options.sm).not.toBe(source.sm);
  expect(Object.isFrozen(size.options.sm)).toBe(true);
  expect(Object.isFrozen(source.sm)).toBe(false);

  source.sm.push("text-sm");
  expect(size("sm")).toBe("px-2 py-1");
  expect(size.options.sm).toEqual(["px-2", "py-1"]);
  expect(source.sm).toEqual(["px-2", "py-1", "text-sm"]);
});

test("variants supports empty-string keys", () => {
  const hidden = variants({ "": "hidden" });
  expect(hidden("")).toBe("hidden");
});

test("empty variant maps return empty strings", () => {
  const empty = variants({});
  expect(empty(undefined)).toBe("");
  // @ts-expect-error testing an unknown runtime key on an empty map
  expect(empty("sm")).toBe("");
  expect(Object.keys(empty.options)).toEqual([]);
  expect(Object.isFrozen(empty.options)).toBe(true);
});

test("empty array values return empty strings without freezing the source", () => {
  const source = { none: [] as string[] };
  const lookup = variants(source);
  expect(lookup("none")).toBe("");
  expect(Object.isFrozen(source.none)).toBe(false);
  expect(Object.isFrozen(lookup.options.none)).toBe(true);
});

test("declared symbol keys also receive independent frozen array snapshots", () => {
  const key = Symbol("tone");
  const source = { [key]: ["text-sm"] };
  const tone = variants(source);
  expectTypeOf<Variant<typeof tone>>().toEqualTypeOf<typeof key>();
  source[key].push("font-bold");
  expect(tone(key)).toBe("text-sm");
  expect(Object.isFrozen(tone.options[key])).toBe(true);
  expect(() => {
    // @ts-expect-error the snapshot array is readonly, and also frozen at runtime
    tone.options[key].push("italic");
  }).toThrow(TypeError);
});

// integration

test("variants output composes with cn", () => {
  const color = variants({
    primary: "bg-blue-500 text-white",
    danger: "bg-red-500 text-white",
  });
  const size = variants({ sm: "px-2 py-1", lg: "px-6 py-3" });
  expect(cn("rounded", color("primary"), size("lg"), "px-8")).toBe(
    "rounded bg-blue-500 text-white py-3 px-8",
  );
});

// types

test("Variant derives the key union from a variant function", () => {
  const size = variants({ sm: "text-sm", lg: "text-lg" });
  expectTypeOf<Variant<typeof size>>().toEqualTypeOf<"sm" | "lg">();
  expectTypeOf<keyof typeof size.options>().toEqualTypeOf<"sm" | "lg">();
});

test("variants preserves literal keys in the call signature", () => {
  const size = variants({ sm: "text-sm", lg: "text-lg" });
  expectTypeOf(size).parameter(0).toEqualTypeOf<"sm" | "lg" | undefined>();
  expectTypeOf(size("sm")).toEqualTypeOf<string>();
});

test("variants return type is assignable to VariantFn", () => {
  const size: VariantFn<{ sm: string; lg: string }> = variants({ sm: "text-sm", lg: "text-lg" });
  expect(size("sm")).toBe("text-sm");
});

test("VariantsOf extracts the lookup interface", () => {
  const size = variants({ sm: "text-sm", lg: "text-lg" });
  expectTypeOf<VariantsOf<typeof size>>().toEqualTypeOf<typeof size>();
});
