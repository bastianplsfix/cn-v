export type VariantOptions = Record<string, string>;

export interface VariantFn<TOptions extends VariantOptions> {
  /** Returns the class string for a variant key. */
  (key: keyof TOptions): string;
  /** A frozen snapshot of the variant map for safe runtime inspection and type extraction. */
  readonly options: Readonly<TOptions>;
}

export type Variant<T extends VariantFn<VariantOptions>> =
  T extends VariantFn<infer TOptions> ? keyof TOptions : never;

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
