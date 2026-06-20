export type Voice = SpeechSynthesisVoice;

export const voiceSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

export const listVoices = (): Voice[] => {
  if (!voiceSupported()) return [];
  return window.speechSynthesis.getVoices();
};

export const speak = (
  text: string,
  opts: { rate?: number; voice?: Voice | null; lang?: string } = {}
) => {
  if (!voiceSupported()) return null;
  cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = opts.rate ?? 1;
  if (opts.voice) u.voice = opts.voice;
  if (opts.lang) u.lang = opts.lang;
  window.speechSynthesis.speak(u);
  return u;
};

const langPrefix = (tag: string) => tag.toLowerCase().split(/[-_]/)[0];

export const voicesForLang = (prefix: string): Voice[] => {
  if (!voiceSupported()) return [];
  const p = langPrefix(prefix);
  return listVoices().filter((v) => langPrefix(v.lang) === p);
};

export const cancel = () => {
  if (!voiceSupported()) return;
  window.speechSynthesis.cancel();
};

export const speechRecognitionSupported = () => {
  if (typeof window === "undefined") return false;
  return (
    "SpeechRecognition" in window ||
    "webkitSpeechRecognition" in window
  );
};

export const startRecognition = (
  onResult: (text: string) => void,
  onError?: (err: string) => void
) => {
  if (!speechRecognitionSupported()) {
    onError?.("Speech recognition not supported in this browser");
    return null;
  }
  const SR =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const r = new SR();
  r.lang = "en-US";
  r.continuous = false;
  r.interimResults = false;
  r.onresult = (e: any) => {
    const text = e.results?.[0]?.[0]?.transcript ?? "";
    if (text) onResult(text);
  };
  r.onerror = (e: any) => onError?.(String(e.error || "error"));
  r.start();
  return r;
};
