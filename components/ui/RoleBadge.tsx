import type { Role } from "@/types";
import { cn } from "@/lib/cn";
import { getRole } from "@/lib/roles";

export function RoleBadge({ role, withIcon }: { role: Role; withIcon?: boolean }) {
  const info = getRole(role);
  const Icon = info.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        info.tone
      )}
    >
      {withIcon && <Icon className="h-3 w-3" />}
      {info.label}
    </span>
  );
}
