import { expect, test } from "vite-plus/test";
import { cn } from "../src/cn.ts";
import { variants } from "../src/variants.ts";

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

test("variants exposes frozen options", () => {
  const size = variants({ sm: "text-sm", lg: "text-lg" });
  expect(size.options).toEqual({ sm: "text-sm", lg: "text-lg" });
  expect(Object.isFrozen(size.options)).toBe(true);
});
