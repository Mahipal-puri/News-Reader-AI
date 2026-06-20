"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import type { Article } from "@/types";
import { Button } from "@/components/ui/Button";
import { cancel, listVoices, speak, voiceSupported } from "@/lib/ai/voice";
import { useAppDispatch, useAppSelector } from "@/store";
import { setVoiceSpeed } from "@/store/slices/preferencesSlice";

export function VoiceReader({ article }: { article: Article }) {
  const supported = voiceSupported();
  const dispatch = useAppDispatch();
  const rate = useAppSelector((s) => s.preferences.voiceSpeed);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState<string>("");
  const [playing, setPlaying] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!supported) return;
    const refresh = () => {
      const v = listVoices();
      setVoices(v);
      if (!voiceName && v[0]) setVoiceName(v[0].name);
    };
    refresh();
    window.speechSynthesis.onvoiceschanged = refresh;
    return () => {
      cancel();
    };
  }, [supported, voiceName]);

  if (!supported) {
    return (
      <p className="text-sm text-neutral-500">
        Voice reading is not supported in this browser.
      </p>
    );
  }

  const text = `${article.title}. ${article.summary} ${article.body}`;
  const start = () => {
    const v = voices.find((x) => x.name === voiceName) ?? null;
    const u = speak(text, { rate, voice: v });
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
      <div className="flex items-center gap-2">
        <Button onClick={toggle} size="md">
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
        <span className="text-xs text-neutral-500">Voice</span>
        <select
          value={voiceName}
          onChange={(e) => setVoiceName(e.target.value)}
          className="mt-1 h-9 w-full rounded-lg border bg-transparent px-2 text-sm"
        >
          {voices.map((v) => (
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
    </div>
  );
}
