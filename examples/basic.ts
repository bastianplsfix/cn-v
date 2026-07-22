import { cn, type Variant, variants } from "cn-variants";

const buttonTone = variants({
  primary: "bg-indigo-600 text-white",
  danger: "bg-red-600 text-white",
});

const buttonSize = variants({
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
});

export type ButtonTone = Variant<typeof buttonTone>;
export type ButtonSize = Variant<typeof buttonSize>;

export interface ButtonClassOptions {
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
}

export function buttonClasses({
  tone = "primary",
  size = "md",
  className,
}: ButtonClassOptions = {}) {
  return cn("rounded-md font-medium", buttonTone(tone), buttonSize(size), className);
}

buttonClasses({ tone: "danger", className: "bg-rose-700" });

// @ts-expect-error unknown variant keys are rejected
buttonClasses({ tone: "warning" });
