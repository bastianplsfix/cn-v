export type VariantOptions = Record<string, string>;

export interface VariantFn<TOptions extends VariantOptions> {
  /** Returns the class string for a variant key. */
  (key: keyof TOptions): string;
  /** The original variant map, frozen for safe runtime inspection and type extraction. */
  readonly options: Readonly<TOptions>;
}

export type Variant<T extends VariantFn<VariantOptions>> =
  T extends VariantFn<infer TOptions> ? keyof TOptions : never;

export function variants<const TOptions extends VariantOptions>(
  map: TOptions,
): VariantFn<TOptions> {
  return Object.assign((key: keyof TOptions): string => map[key] ?? "", {
    options: Object.freeze(map),
  });
}
