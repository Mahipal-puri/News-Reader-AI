"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  Bookmark,
  LogIn,
  Menu,
  Moon,
  Search,
  Sun,
  User as UserIcon,
  Newspaper
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { signOut } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/Button";
import { RoleBadge } from "@/components/ui/RoleBadge";

export function Navbar({ onMenu }: { onMenu?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const user = useAppSelector((s) => s.auth.user);
  const role = useAppSelector((s) => s.auth.role);
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const links = [
    { href: "/home", label: "Home" },
    { href: "/search", label: "Search" },
    { href: "/bookmarks", label: "Bookmarks" }
  ];

  return (
    <header className="sticky top-0 z-30 glass">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        <button
          aria-label="Open menu"
          onClick={onMenu}
          className="md:hidden rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href={user ? "/home" : "/"}
          className="flex items-center gap-2 font-semibold"
        >
          <Newspaper className="h-5 w-5 text-brand-600" />
          <span>News<span className="text-brand-600">AI</span></span>
        </Link>
        <nav className="ml-6 hidden gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                pathname === l.href
                  ? "bg-neutral-100 dark:bg-neutral-800"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => router.push("/search")}
          className="ml-auto hidden h-9 w-72 items-center gap-2 rounded-lg border px-3 text-sm text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 md:flex"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
          <span>Search news, topics, sources…</span>
          <kbd className="ml-auto rounded border px-1.5 py-0.5 text-[10px]">/</kbd>
        </button>
        <Link
          href="/notifications"
          className="ml-auto rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 md:ml-2"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Link>
        <Link
          href="/bookmarks"
          className="hidden rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 md:inline-flex"
          aria-label="Bookmarks"
        >
          <Bookmark className="h-5 w-5" />
        </Link>
        <button
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          className="rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Toggle theme"
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        {user ? (
          <div className="ml-1 flex items-center gap-2">
            <Link
              href="/profile"
              className="hidden items-center gap-2 rounded-lg px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 sm:inline-flex"
            >
              <img
                src={user.avatarUrl}
                alt=""
                className="h-7 w-7 rounded-full"
              />
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium">{user.name}</span>
                <RoleBadge role={role} withIcon />
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                dispatch(signOut());
                router.push("/");
              }}
            >
              Sign out
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => router.push("/login")}>
            <LogIn className="h-4 w-4" />
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
