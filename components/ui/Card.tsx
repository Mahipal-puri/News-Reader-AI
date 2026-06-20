import { cn } from "@/lib/cn";
import { HTMLAttributes } from "react";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-[rgb(var(--card))] shadow-sm transition-colors",
        className
      )}
      {...rest}
    />
  );
}
