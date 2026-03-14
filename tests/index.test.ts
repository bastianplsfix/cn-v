import { expect, test } from "vite-plus/test";
import { cn } from "../src/cn.ts";

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
