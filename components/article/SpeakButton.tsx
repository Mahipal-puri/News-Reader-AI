"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Volume2 } from "lucide-react";
import type { Article } from "@/types";
import { cn } from "@/lib/cn";
import { cancel, speak, voiceSupported } from "@/lib/ai/voice";
import { LANGUAGES, findLanguage, type LanguageCode } from "@/lib/languages";
import { useAppSelector } from "@/store";

type Tone = "light" | "dark";

const langPrefix = (tag: string) => tag.toLowerCase().split(/[-_]/)[0];

export function SpeakButton({
  article,
  tone = "light",
  className
}: {
  article: Article;
  tone?: Tone;
  className?: string;
}) {
  const userLocale = useAppSelector((s) => s.preferences.locale);
  const rate = useAppSelector((s) => s.preferences.voiceSpeed);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<LanguageCode>(
    (userLocale as LanguageCode) ?? "en"
  );
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => () => cancel(), []);

  if (!voiceSupported()) return null;

  const stop = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    cancel();
    setPlaying(false);
  };

  const start = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const langMeta = findLanguage(lang);
    const translation = (article.translations as
      | Partial<Record<string, { title: string; summary: string }>>
      | undefined)?.[lang];
    const text =
      lang !== "en" && translation
        ? `${translation.title}. ${translation.summary}`
        : `${article.title}. ${article.summary}`;
    const sysVoices = window.speechSynthesis.getVoices();
    const v =
      sysVoices.find((x) => langPrefix(x.lang) === lang) ?? null;
    const u = speak(text, { rate, voice: v, lang: langMeta?.locale });
    if (!u) return;
    utterRef.current = u;
    setPlaying(true);
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
  };

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (playing) {
      stop();
    } else {
      start();
    }
  };

  const togglePanel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((v) => !v);
  };

  const langMeta = findLanguage(lang);

  const baseBtn =
    tone === "dark"
      ? "bg-black/40 text-white backdrop-blur hover:bg-black/60"
      : "bg-[rgb(var(--card))] border hover:bg-neutral-100 dark:hover:bg-neutral-800";

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Stop reading" : "Read this article aloud"}
        aria-pressed={playing}
        className={cn(
          "grid h-8 w-8 place-items-center rounded-full transition-colors",
          baseBtn,
          playing && "ring-2 ring-brand-500"
        )}
      >
        {playing ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Volume2 className={cn("h-4 w-4", playing && "animate-pulse")} />
        )}
      </button>
      <button
        type="button"
        onClick={togglePanel}
        aria-label="Change reading language"
        aria-expanded={open}
        className={cn(
          "ml-1 inline-flex h-8 items-center gap-1 rounded-full px-2 text-[11px] font-medium transition-colors",
          baseBtn
        )}
      >
        <span lang={lang}>{langMeta?.native ?? lang}</span>
        <span aria-hidden>▾</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose reading language"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-9 z-30 w-56 rounded-xl border bg-[rgb(var(--card))] p-2 text-sm shadow-[var(--shadow-3)]"
        >
          <label className="block">
            <span className="px-1 text-[11px] text-neutral-500">Read in</span>
            <select
              value={lang}
              onChange={(e) => {
                stop();
                setLang(e.target.value as LanguageCode);
              }}
              className="mt-1 h-9 w-full rounded-lg border bg-transparent px-2 text-sm"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} lang={l.code}>
                  {l.name} — {l.native}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                stop(e);
                start(e);
                setOpen(false);
              }}
              className="flex-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
            >
              {playing ? "Restart" : "Play"}
            </button>
            {playing && (
              <button
                type="button"
                onClick={stop}
                className="rounded-lg border px-3 py-1.5 text-xs"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
