"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bookmark,
  Compass,
  Home,
  Newspaper,
  Search,
  Settings,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useGetCategoriesQuery } from "@/store/api/newsApi";

const NAV = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { data } = useGetCategoriesQuery();

  return (
    <aside className={cn("space-y-6", className)}>
      <nav className="space-y-1">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active =
            n.href === "/home"
              ? pathname === n.href
              : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              <Icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div>
        <div className="mb-2 flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          <Compass className="h-3.5 w-3.5" /> Categories
        </div>
        <div className="space-y-0.5">
          {data?.categories.map((c) => {
            const href = `/category/${c.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={c.slug}
                href={href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-neutral-100 dark:bg-neutral-800"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden>{c.emoji}</span>
                  {c.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
