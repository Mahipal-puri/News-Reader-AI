"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bookmark, Home, Search, User } from "lucide-react";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/bookmarks", icon: Bookmark, label: "Saved" },
  { href: "/notifications", icon: Bell, label: "Alerts" },
  { href: "/profile", icon: User, label: "Me" }
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-[rgb(var(--bg))]/95 backdrop-blur md:hidden">
      {ITEMS.map((n) => {
        const Icon = n.icon;
        const active =
          n.href === "/home" ? pathname === n.href : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "flex flex-col items-center gap-1 py-2 text-[11px]",
              active ? "text-brand-600" : "text-neutral-500"
            )}
          >
            <Icon className="h-5 w-5" />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
