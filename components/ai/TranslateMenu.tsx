"use client";
import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import type { Article } from "@/types";
import { Button } from "@/components/ui/Button";
import { LANGUAGES, type LanguageCode, findLanguage } from "@/lib/languages";
import { useAppSelector } from "@/store";

export function TranslateMenu({ article }: { article: Article }) {
  const userLocale = useAppSelector((s) => s.preferences.locale);
  const [lang, setLang] = useState<LanguageCode>(userLocale ?? "en");

  // If the user changes locale in Settings while the panel is open, follow.
  useEffect(() => {
    setLang(userLocale ?? "en");
  }, [userLocale]);

  const seeded = article.translations as
    | Partial<Record<string, { title: string; summary: string }>>
    | undefined;

  const translation =
    lang === "en"
      ? { title: article.title, summary: article.summary }
      : seeded?.[lang] ?? {
          title: `[${lang.toUpperCase()}] ${article.title}`,
          summary: `[${lang.toUpperCase()}] ${article.summary}`
        };

  const langMeta = findLanguage(lang);
  const hasRealTranslation = lang === "en" || !!seeded?.[lang];

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs text-neutral-500">Translate to</span>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as LanguageCode)}
          className="mt-1 h-10 w-full rounded-lg border bg-transparent px-2 text-sm"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code} lang={l.code}>
              {l.name} — {l.native}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap gap-1.5">
        {LANGUAGES.slice(0, 6).map((l) => (
          <Button
            key={l.code}
            variant={lang === l.code ? "primary" : "outline"}
            size="sm"
            onClick={() => setLang(l.code)}
          >
            <Languages className="h-3.5 w-3.5" />
            <span lang={l.code}>{l.native}</span>
          </Button>
        ))}
      </div>

      <div
        lang={lang}
        className="rounded-xl border bg-neutral-50 p-3 text-sm dark:bg-neutral-900"
      >
        <div className="font-semibold leading-snug">{translation.title}</div>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
          {translation.summary}
        </p>
        <p className="mt-2 text-[11px] text-neutral-400">
          {langMeta?.name} · {langMeta?.native}
        </p>
      </div>

      {!hasRealTranslation && (
        <p className="text-xs text-neutral-500">
          Showing a stub for {langMeta?.name}. In production this would call a
          translation service (e.g. Google Translate, Bhashini for Indian
          languages).
        </p>
      )}
    </div>
  );
}
