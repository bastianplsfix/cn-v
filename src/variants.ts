/** Maps the allowed keys for one variant axis to their class strings. */
export type VariantOptions = Record<string, string>;

/** A typed class lookup created by {@link variants}. */
export interface VariantFn<TOptions extends VariantOptions> {
  /**
   * Returns the class string for a variant key.
   *
   * Invalid keys are rejected by TypeScript. Untyped runtime calls with an
   * unknown or inherited key return an empty string.
   */
  (key: keyof TOptions): string;
  /** A frozen snapshot of the variant map for safe runtime inspection and type extraction. */
  readonly options: Readonly<TOptions>;
}

/** Extracts the allowed key union from a function returned by {@link variants}. */
export type Variant<T extends VariantFn<VariantOptions>> =
  T extends VariantFn<infer TOptions> ? keyof TOptions : never;

/**
 * Creates a typed class lookup for one variant axis.
 *
 * Pass the key-to-class map directly. Defaults and compound variants stay in
 * the consuming component and can be composed with {@link cn}. The input map
 * is copied; the returned function exposes that frozen snapshot as `.options`.
 *
 * @example
 * ```ts
 * const tone = variants({
 *   primary: "bg-indigo-600 text-white",
 *   danger: "bg-red-600 text-white",
 * });
 *
 * tone("primary");
 * type Tone = Variant<typeof tone>; // "primary" | "danger"
 * ```
 */
export function variants<const TOptions extends VariantOptions>(
  map: TOptions,
): VariantFn<TOptions> {
  const options = Object.freeze({ ...map });
  return Object.assign(
    (key: keyof TOptions): string =>
      Object.prototype.hasOwnProperty.call(options, key) ? options[key] : "",
    {
      options,
    },
  );
}
