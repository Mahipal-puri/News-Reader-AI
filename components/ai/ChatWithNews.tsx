"use client";
import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import type { Article } from "@/types";
import { fakeChat } from "@/lib/ai/fakeChat";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Msg = { role: "user" | "ai"; text: string };

export function ChatWithNews({ article }: { article: Article }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Ask me anything about this article." }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    const q = input.trim();
    if (!q || busy) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    const answer = await fakeChat(article, q);
    setMessages((m) => [...m, { role: "ai", text: answer }]);
    setBusy(false);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const suggestions = ["Summarize this article", "Key takeaways?", "Why does this matter?"];

  return (
    <div className="flex flex-col gap-3">
      <div
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        className="max-h-72 space-y-2 overflow-y-auto pr-1 text-sm"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-brand-600 px-3 py-2 text-white"
                : "max-w-[85%] rounded-2xl rounded-bl-sm bg-neutral-100 px-3 py-2 dark:bg-neutral-800"
            }
          >
            {m.text.split("\n").map((line, j) => (
              <p key={j} className={j > 0 ? "mt-1" : undefined}>
                {line}
              </p>
            ))}
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setInput(s)}
            className="rounded-full border px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this article…"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <Button onClick={send} disabled={busy} size="md" aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
