"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Info, Pause, Play, Square } from "lucide-react";
import type { Article } from "@/types";
import { Button } from "@/components/ui/Button";
import { cancel, listVoices, speak, voiceSupported } from "@/lib/ai/voice";
import { LANGUAGES, findLanguage, type LanguageCode } from "@/lib/languages";
import { useAppDispatch, useAppSelector } from "@/store";
import { setVoiceSpeed } from "@/store/slices/preferencesSlice";

const langPrefix = (tag: string) => tag.toLowerCase().split(/[-_]/)[0];

export function VoiceReader({ article }: { article: Article }) {
  const supported = voiceSupported();
  const dispatch = useAppDispatch();
  const rate = useAppSelector((s) => s.preferences.voiceSpeed);
  const userLocale = useAppSelector((s) => s.preferences.locale);
  const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [lang, setLang] = useState<LanguageCode>(
    (userLocale as LanguageCode) ?? "en"
  );
  const [voiceName, setVoiceName] = useState<string>("");
  const [playing, setPlaying] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!supported) return;
    const refresh = () => setAllVoices(listVoices());
    refresh();
    window.speechSynthesis.onvoiceschanged = refresh;
    return () => {
      cancel();
    };
  }, [supported]);

  const matchingVoices = useMemo(
    () => allVoices.filter((v) => langPrefix(v.lang) === lang),
    [allVoices, lang]
  );

  useEffect(() => {
    if (!matchingVoices.some((v) => v.name === voiceName)) {
      setVoiceName(matchingVoices[0]?.name ?? "");
    }
  }, [matchingVoices, voiceName]);

  if (!supported) {
    return (
      <p className="text-sm text-neutral-500">
        Voice reading is not supported in this browser.
      </p>
    );
  }

  const langMeta = findLanguage(lang);
  const translation = (article.translations as
    | Partial<Record<string, { title: string; summary: string }>>
    | undefined)?.[lang];
  const usesTranslation = lang !== "en" && !!translation;
  const speakable = usesTranslation
    ? `${translation!.title}. ${translation!.summary}`
    : `${article.title}. ${article.summary} ${article.body}`;

  const start = () => {
    const v = allVoices.find((x) => x.name === voiceName) ?? null;
    const u = speak(speakable, { rate, voice: v, lang: langMeta?.locale });
    if (!u) return;
    utterRef.current = u;
    setPlaying(true);
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
  };
  const stop = () => {
    cancel();
    setPlaying(false);
  };
  const toggle = () => (playing ? stop() : start());

  return (
    <div className="space-y-3 text-sm">
      <label className="block">
        <span className="text-xs text-neutral-500">Read in</span>
        <select
          value={lang}
          onChange={(e) => {
            stop();
            setLang(e.target.value as LanguageCode);
          }}
          className="mt-1 h-10 w-full rounded-lg border bg-transparent px-2 text-sm"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code} lang={l.code}>
              {l.name} — {l.native}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-2">
        <Button onClick={toggle} size="md" disabled={matchingVoices.length === 0}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pause" : "Listen"}
        </Button>
        {playing && (
          <Button variant="outline" size="md" onClick={stop}>
            <Square className="h-4 w-4" />
            Stop
          </Button>
        )}
      </div>

      <label className="block">
        <span className="text-xs text-neutral-500">
          Voice — {matchingVoices.length} for {langMeta?.name}
        </span>
        <select
          value={voiceName}
          onChange={(e) => setVoiceName(e.target.value)}
          disabled={matchingVoices.length === 0}
          className="mt-1 h-9 w-full rounded-lg border bg-transparent px-2 text-sm disabled:opacity-60"
        >
          {matchingVoices.length === 0 && (
            <option value="">No {langMeta?.name} voice installed</option>
          )}
          {matchingVoices.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs text-neutral-500">
          Speed: {rate.toFixed(2)}×
        </span>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.05}
          value={rate}
          onChange={(e) => dispatch(setVoiceSpeed(Number(e.target.value)))}
          className="mt-1 w-full"
        />
      </label>

      {matchingVoices.length === 0 && (
        <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <Info className="h-4 w-4 flex-none" />
          <p>
            Your browser has no installed {langMeta?.name} voice. On Windows:
            Settings → Time &amp; Language → Speech → Add a voice. On macOS:
            System Settings → Accessibility → Spoken Content → System Voice →
            Manage Voices.
          </p>
        </div>
      )}

      {lang !== "en" && !translation && matchingVoices.length > 0 && (
        <p className="text-[11px] text-neutral-500">
          Reading the English text with a {langMeta?.name} voice — pronunciation
          will be approximate. A seeded {langMeta?.name} translation would speak
          natively.
        </p>
      )}
      {usesTranslation && (
        <p className="text-[11px] text-neutral-500">
          Speaking the {langMeta?.name} translation of the headline.
        </p>
      )}
    </div>
  );
}
