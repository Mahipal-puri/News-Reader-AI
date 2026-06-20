"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Volume2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { cancel, speak, voiceSupported } from "@/lib/ai/voice";
import { LANGUAGES, findLanguage, type LanguageCode } from "@/lib/languages";
import { useAppSelector } from "@/store";

const langPrefix = (tag: string) => tag.toLowerCase().split(/[-_]/)[0];

export function SpeakInline({
  text,
  label = "Speak",
  className
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const userLocale = useAppSelector((s) => s.preferences.locale);
  const rate = useAppSelector((s) => s.preferences.voiceSpeed);
  const [lang, setLang] = useState<LanguageCode>(
    (userLocale as LanguageCode) ?? "en"
  );
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  const stop = () => {
    cancel();
    setPlaying(false);
  };
  const start = () => {
    const langMeta = findLanguage(lang);
    const sysVoices = window.speechSynthesis.getVoices();
    const v = sysVoices.find((x) => langPrefix(x.lang) === lang) ?? null;
    const u = speak(text, { rate, voice: v, lang: langMeta?.locale });
    if (!u) return;
    setPlaying(true);
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
  };
  const toggle = () => (playing ? stop() : start());

  const langMeta = findLanguage(lang);

  return (
    <div
      ref={rootRef}
      className={cn("relative inline-flex items-center gap-1", className)}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Stop reading" : label}
        aria-pressed={playing}
        className={cn(
          "inline-flex h-7 items-center gap-1 rounded-full border bg-[rgb(var(--card))] px-2 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800",
          playing && "ring-2 ring-brand-500"
        )}
      >
        {playing ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Volume2 className="h-3.5 w-3.5" />
        )}
        {playing ? "Stop" : label}
      </button>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change reading language"
        aria-expanded={open}
        className="inline-flex h-7 items-center gap-1 rounded-full border bg-[rgb(var(--card))] px-2 text-[11px] font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <span lang={lang}>{langMeta?.native ?? lang}</span>
        <span aria-hidden>▾</span>
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Choose reading language"
          className="absolute right-0 top-8 z-30 w-56 rounded-xl border bg-[rgb(var(--card))] p-2 text-sm shadow-[var(--shadow-3)]"
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
          <button
            type="button"
            onClick={() => {
              stop();
              start();
              setOpen(false);
            }}
            className="mt-2 w-full rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
          >
            {playing ? "Restart" : "Play"}
          </button>
        </div>
      )}
    </div>
  );
}
