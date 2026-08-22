import { type ClassValue, type Variant, variants } from "../src/index.ts";

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

const withArray = variants({ sm: ["px-2", "py-1"] });
export type ArrayValuesReturnStrings = Expect<Equal<ReturnType<typeof withArray>, string>>;
export type ArrayValuesInferKeys = Expect<Equal<Variant<typeof withArray>, "sm">>;

export function assertInvalidTypesAreRejected() {
  // @ts-expect-error unknown variant keys are rejected
  size("xl");
  // @ts-expect-error options cannot be reassigned
  size.options.sm = "text-base";
}

export type UndefinedKeyIsAccepted = Expect<
  Equal<Parameters<typeof size>[0], "sm" | "lg" | undefined>
>;
