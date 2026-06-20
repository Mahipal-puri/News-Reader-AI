"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, invalid, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-brand-500",
        invalid && "border-red-500 focus-visible:ring-red-500",
        className
      )}
      {...rest}
    />
  );
});
