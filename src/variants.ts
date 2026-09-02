/** A class string, or a list of class strings joined with spaces. */
export type VariantValue = string | readonly string[];

/** Maps the allowed keys for one variant axis to their classes. */
export type VariantOptions = Record<string, VariantValue>;

/** A typed class lookup created by {@link variants}. */
export interface VariantFn<TOptions extends VariantOptions> {
  /** Returns the class string for a variant key, or `""` for `undefined` and unknown runtime keys. */
  (key: keyof TOptions | undefined): string;
  /** Frozen snapshot of the variant map, including copied frozen arrays. */
  readonly options: Readonly<TOptions>;
}

/** Extracts the allowed key union from a function returned by {@link variants}. */
export type Variant<T extends VariantFn<VariantOptions>> =
  T extends VariantFn<infer TOptions> ? keyof TOptions : never;

/**
 * Extracts the typed lookup interface from a value created by
 * {@link variants}, for annotating wrapper functions and parameters.
 *
 * @example
 * ```ts
 * const size = variants({ sm: "text-sm" });
 *
 * function applyStyle(lookup: VariantsOf<typeof size>) {
 *   return cn("font-medium", lookup(undefined));
 * }
 * ```
 */
export type VariantsOf<T> = T extends VariantFn<infer TOptions> ? VariantFn<TOptions> : never;

function toClassString(value: string | readonly string[]): string {
  return typeof value === "string" ? value : value.join(" ");
}

/**
 * Creates a typed class lookup for one variant axis.
 *
 * Pass a key-to-class map. Values may be a class string or an array of class
 * strings, which are joined with spaces. Empty-string keys are allowed.
 * `.options` is a frozen snapshot of the map, including copied frozen arrays.
 *
 * @example
 * ```ts
 * const tone = variants({
 *   primary: "bg-indigo-600 text-white",
 *   danger: ["bg-red-600", "text-white"],
 * });
 *
 * tone("primary");
 * type Tone = Variant<typeof tone>; // "primary" | "danger"
 * ```
 */
export function variants<const TOptions extends VariantOptions>(
  map: TOptions,
): VariantFn<TOptions> {
  const options = Object.assign(Object.create(null), map);
  for (const key of Object.keys(options)) {
    const value = options[key];
    if (Array.isArray(value)) {
      options[key] = Object.freeze(value.slice());
    }
  }
  Object.freeze(options);
  return Object.assign(
    (key: keyof TOptions | undefined): string =>
      key !== undefined && Object.hasOwn(options, key) ? toClassString(options[key]) : "",
    {
      options,
    },
  );
}
