import { cn } from "@/lib/cn";

export function LiveBadge({
  className,
  size = "sm"
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm bg-rose-600 font-semibold uppercase tracking-wide text-white",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        className
      )}
    >
      <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
      Live
    </span>
  );
}
