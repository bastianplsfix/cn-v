import { expect, expectTypeOf, test } from "vite-plus/test";
import { cn } from "../src/cn.ts";
import { createCn } from "../src/create-cn.ts";
import { type Variant, type VariantFn, variants } from "../src/variants.ts";

// createCn

test("createCn combines class names like cn", () => {
  const customCn = createCn((classes) => classes);
  expect(customCn("foo", "bar")).toBe("foo bar");
});

test("createCn handles clsx input types", () => {
  const customCn = createCn((classes) => classes);
  expect(customCn("base", ["flex", undefined], { bold: true }, false, null)).toBe("base flex bold");
});

test("createCn uses the provided merger", () => {
  const customCn = createCn(() => "merged");
  expect(customCn("px-2", "px-4")).toBe("merged");
});

test("createCn returns empty string for no arguments", () => {
  const customCn = createCn((classes) => classes);
  expect(customCn()).toBe("");
});

test("createCn works with a real extendTailwindMerge merger", async () => {
  const { extendTailwindMerge } = await import("tailwind-merge");
  const twMerge = extendTailwindMerge({
    extend: {
      classGroups: {
        "bg-color": [{ bg: ["primary", "secondary"] }],
      },
    },
  });
  const customCn = createCn(twMerge);
  expect(customCn("bg-primary px-2", "px-4 bg-secondary")).toBe("px-4 bg-secondary");
});

test("options snapshot preserves array values untouched", () => {
  const source = { sm: ["px-2", "py-1"] as const };
  const size = variants(source);
  expect(size.options.sm).toEqual(["px-2", "py-1"]);
  expect(size.options.sm).toBe(source.sm);
});

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
  expect(lookup("toString")).toBe("");
  expect(lookup("constructor")).toBe("");
  expect(lookup("__proto__")).toBe("");
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

test("variants supports empty-string keys", () => {
  const hidden = variants({ "": "hidden" });
  expect(hidden("")).toBe("hidden");
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
