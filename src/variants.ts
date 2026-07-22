export function variants<T extends Record<string, string>>(map: T) {
  const options = Object.freeze({ ...map });
  const fn = (key: keyof T): string =>
    Object.prototype.hasOwnProperty.call(options, key) ? options[key] : "";
  fn.options = options;
  return fn;
}
