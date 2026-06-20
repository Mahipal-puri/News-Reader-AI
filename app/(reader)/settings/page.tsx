"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Check, Crown, LogOut, Moon, Palette, Search, Shield, Sun, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setRole, signOut } from "@/store/slices/authSlice";
import { ROLES, getRole } from "@/lib/roles";
import type { Role } from "@/types";
import {
  setLocale,
  setNotificationFlag,
  setCategoryAlert,
  setAccentColor,
  type AccentColor
} from "@/store/slices/preferencesSlice";
import { useGetCategoriesQuery } from "@/store/api/newsApi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { LANGUAGES, findLanguage, type LanguageCode } from "@/lib/languages";

const ACCENTS: Array<{ id: AccentColor; label: string; swatch: string }> = [
  { id: "blue",    label: "Ocean",   swatch: "#2476ff" },
  { id: "violet",  label: "Violet",  swatch: "#8b5cf6" },
  { id: "rose",    label: "Rose",    swatch: "#f43f5e" },
  { id: "emerald", label: "Emerald", swatch: "#10b981" },
  { id: "amber",   label: "Amber",   swatch: "#f59e0b" },
  { id: "teal",    label: "Teal",    swatch: "#14b8a6" }
];

function Switch({
  checked,
  onChange,
  label,
  description
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border bg-[rgb(var(--card))] p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-neutral-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-brand-600" : "bg-neutral-300 dark:bg-neutral-700"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const prefs = useAppSelector((s) => s.preferences);
  const role = useAppSelector((s) => s.auth.role);
  const user = useAppSelector((s) => s.auth.user);
  const { data: cats } = useGetCategoriesQuery();
  const [langQuery, setLangQuery] = useState("");

  const currentLang = findLanguage(prefs.locale);

  const filteredLanguages = useMemo(() => {
    const q = langQuery.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        l.native.toLowerCase().includes(q)
    );
  }, [langQuery]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="text-sm text-neutral-500">
          Personalize your reading experience.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border p-3 text-sm capitalize transition-colors",
                theme === t
                  ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              {t === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : t === "light" ? (
                <Sun className="h-4 w-4" />
              ) : null}
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-brand-600" />
          <h2 className="text-lg font-semibold">Accent color</h2>
        </div>
        <p className="text-sm text-neutral-500">
          Pick a color — buttons, links, highlights, and the reading-progress bar
          will update across the app.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ACCENTS.map((a) => {
            const active = prefs.accentColor === a.id;
            return (
              <button
                key={a.id}
                onClick={() => {
                  dispatch(setAccentColor(a.id));
                  toast(`Accent set to ${a.label}`, "success");
                }}
                aria-pressed={active}
                aria-label={`Set accent to ${a.label}`}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors",
                  active
                    ? "border-brand-600 ring-2 ring-brand-500/40"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                <span
                  className="grid h-9 w-9 place-items-center rounded-full text-white shadow-[var(--shadow-2)]"
                  style={{ background: a.swatch }}
                >
                  {active && <Check className="h-4 w-4" />}
                </span>
                <span className="text-xs">{a.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Language</h2>
        <p className="text-sm text-neutral-500">
          Reading language —{" "}
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {currentLang ? `${currentLang.name} · ${currentLang.native}` : prefs.locale}
          </span>
          . English plus the 22 official languages of India.
        </p>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-neutral-400" />
          <Input
            value={langQuery}
            onChange={(e) => setLangQuery(e.target.value)}
            placeholder="Search languages (English, Tamil, தமிழ், ta…)"
            className="pl-9"
          />
        </div>
        <div className="grid max-h-[28rem] grid-cols-2 gap-2 overflow-y-auto rounded-xl border p-2 sm:grid-cols-3">
          {filteredLanguages.map((l) => {
            const active = prefs.locale === l.code;
            return (
              <button
                key={l.code}
                onClick={() => {
                  dispatch(setLocale(l.code));
                  toast(`Language set to ${l.name}`, "success");
                }}
                lang={l.code}
                className={cn(
                  "flex flex-col items-start gap-0.5 rounded-lg border p-2.5 text-left transition-colors",
                  active
                    ? "border-brand-600 bg-brand-50 dark:bg-brand-900/30"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                <span className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium">{l.name}</span>
                  <span className="text-[10px] uppercase text-neutral-400">
                    {l.code}
                  </span>
                </span>
                <span className="truncate text-base">{l.native}</span>
              </button>
            );
          })}
          {filteredLanguages.length === 0 && (
            <p className="col-span-full p-4 text-center text-sm text-neutral-500">
              No language matches "{langQuery}"
            </p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <div className="grid gap-2">
          <Switch
            checked={prefs.notifications.breaking}
            onChange={(v) => dispatch(setNotificationFlag({ key: "breaking", value: v }))}
            label="Breaking news"
            description="Real-time alerts for major stories."
          />
          <Switch
            checked={prefs.notifications.daily}
            onChange={(v) => dispatch(setNotificationFlag({ key: "daily", value: v }))}
            label="Daily briefing"
            description="A 6 AM summary, every weekday."
          />
          <Switch
            checked={prefs.notifications.weekly}
            onChange={(v) => dispatch(setNotificationFlag({ key: "weekly", value: v }))}
            label="Weekly digest"
            description="The big stories you may have missed."
          />
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium">Category alerts</p>
          <div className="flex flex-wrap gap-2">
            {cats?.categories.map((c) => {
              const on = !!prefs.notifications.categories[c.slug];
              return (
                <button
                  key={c.slug}
                  onClick={() =>
                    dispatch(setCategoryAlert({ category: c.slug, value: !on }))
                  }
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm",
                    on
                      ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  )}
                >
                  <span className="mr-1" aria-hidden>{c.emoji}</span>
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-brand-600" />
          <h2 className="text-lg font-semibold">Role</h2>
        </div>
        <p className="text-sm text-neutral-500">
          Current role:{" "}
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {getRole(role).label}
          </span>{" "}
          — {getRole(role).short}. Switch to preview what each role sees and can
          do.
        </p>
        <div className="space-y-4">
          {(["audience", "editorial", "admin"] as const).map((group) => (
            <div key={group}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {group === "audience"
                  ? "Audience"
                  : group === "editorial"
                  ? "Editorial"
                  : "Administration"}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {ROLES.filter((r) => r.group === group).map((r) => {
                  const active = role === r.id;
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        dispatch(setRole(r.id as Role));
                        toast(`Now acting as ${r.label}`, "success");
                      }}
                      aria-pressed={active}
                      className={cn(
                        "flex flex-col gap-2 rounded-xl border bg-[rgb(var(--card))] p-3 text-left transition-colors",
                        active
                          ? "border-brand-600 ring-2 ring-brand-500/40"
                          : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "grid h-7 w-7 place-items-center rounded-lg",
                            r.tone
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm font-semibold">{r.label}</span>
                        {active && (
                          <Check className="ml-auto h-4 w-4 text-brand-600" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500">{r.short}</p>
                      <ul className="space-y-0.5 text-[11px] text-neutral-600 dark:text-neutral-400">
                        {r.capabilities.slice(0, 3).map((cap) => (
                          <li key={cap} className="flex items-start gap-1.5">
                            <span className="mt-1 inline-block h-1 w-1 flex-none rounded-full bg-brand-500" />
                            {cap}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Membership</h2>
        <div className="rounded-2xl border bg-gradient-to-br from-brand-50 to-violet-50 p-5 dark:from-brand-900/30 dark:to-violet-900/30">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold">Premium membership</h3>
          </div>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            Ad-free, unlimited bookmarks, advanced AI insights.
          </p>
          {role === "premium" ? (
            <Button
              className="mt-3"
              variant="outline"
              onClick={() => {
                dispatch(setRole("user"));
                toast("Reverted to Reader", "info");
              }}
            >
              Downgrade to Reader
            </Button>
          ) : (
            <Button
              className="mt-3"
              onClick={() => {
                dispatch(setRole("premium"));
                toast("Welcome to Premium (demo)", "success");
              }}
            >
              Upgrade to Premium
            </Button>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Account</h2>
        {user ? (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                dispatch(signOut());
                router.push("/");
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (typeof window === "undefined") return;
                localStorage.clear();
                location.reload();
              }}
            >
              <Trash2 className="h-4 w-4" />
              Clear all local data
            </Button>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Not signed in.</p>
        )}
      </section>
    </div>
  );
}
