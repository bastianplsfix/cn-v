export function variants<T extends Record<string, string>>(map: T) {
  const fn = (key: keyof T): string => map[key] ?? "";
  fn.options = Object.freeze(map);
  return fn;
}
