import { type ClassValue, type Variant, type VariantsOf, variants } from "../src/index.ts";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? true
    : false;
type Expect<Value extends true> = Value;

const size = variants({ sm: "text-sm", lg: "text-lg" });

export type VariantKeyIsInferred = Expect<
  Equal<Parameters<typeof size>[0], "sm" | "lg" | undefined>
>;
export type OptionsAreReadonly = Expect<
  Equal<typeof size.options, { readonly sm: "text-sm"; readonly lg: "text-lg" }>
>;
export type ClassValueIsExported = Expect<Equal<Extract<ClassValue, string>, string>>;
export type VariantsOfPreservesLookup = Expect<Equal<VariantsOf<typeof size>, typeof size>>;

const withArray = variants({ sm: ["px-2", "py-1"] });
export type ArrayValuesReturnStrings = Expect<Equal<ReturnType<typeof withArray>, string>>;
export type ArrayValuesInferKeys = Expect<Equal<Variant<typeof withArray>, "sm">>;

const mutableSource = { sm: ["px-2"] as string[] };
const mutable = variants(mutableSource);
const tuple = variants({ sm: ["px-2", "py-1"] as [string, string] });
const readonlyArray = variants({ sm: ["px-2"] as readonly string[] });
const mixed = variants({ sm: "px-2" as string | string[] });
const empty = variants({});
const tone = variants({ primary: "bg-blue-500" });

export type MutableArraysBecomeReadonly = Expect<
  Equal<typeof mutable.options.sm, readonly string[]>
>;
export type MutableTuplesBecomeReadonly = Expect<
  Equal<typeof tuple.options.sm, readonly [string, string]>
>;
export type ReadonlyArraysStayReadonly = Expect<
  Equal<typeof readonlyArray.options.sm, readonly string[]>
>;
export type LiteralTuplesStayLiteral = Expect<
  Equal<typeof withArray.options.sm, readonly ["px-2", "py-1"]>
>;
export type MixedValuesStayReadonly = Expect<
  Equal<typeof mixed.options.sm, string | readonly string[]>
>;
export type MutableArrayKeysArePreserved = Expect<Equal<Variant<typeof mutable>, "sm">>;
export type MutableArrayLookupIsPreserved = Expect<
  Equal<VariantsOf<typeof mutable>, typeof mutable>
>;
export type VariantsOfDistributes = Expect<
  Equal<VariantsOf<typeof size | typeof tone>, typeof size | typeof tone>
>;
export type VariantDistributes = Expect<
  Equal<Variant<typeof size | typeof tone>, "sm" | "lg" | "primary">
>;
export type VariantsOfRejectsNonLookups = Expect<Equal<VariantsOf<string | (() => string)>, never>>;
export type EmptyMapHasNoKeys = Expect<Equal<Variant<typeof empty>, never>>;
export type EmptyMapAcceptsUndefined = Expect<Equal<Parameters<typeof empty>[0], undefined>>;

// The caller retains ownership of its mutable arrays.
mutableSource.sm.push("py-2");

export function assertInvalidTypesAreRejected() {
  // @ts-expect-error unknown variant keys are rejected
  size("xl");
  // @ts-expect-error options cannot be reassigned
  size.options.sm = "text-base";
  // @ts-expect-error snapshot arrays are frozen, regardless of input mutability
  mutable.options.sm.push("py-2");
  // @ts-expect-error snapshot array entries cannot be reassigned
  mutable.options.sm[0] = "px-4";
  // @ts-expect-error snapshot tuples cannot be mutated
  tuple.options.sm[0] = "px-4";
  // @ts-expect-error empty maps have no valid named key
  empty("sm");
}
