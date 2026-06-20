"use client";
import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppSelector } from "@/store";
import { timeAgo } from "@/lib/format";

type Comment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

const SEED: Comment[] = [
  {
    id: "c1",
    authorName: "Aanya",
    body: "Great context — the binding language is the real shift.",
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString()
  },
  {
    id: "c2",
    authorName: "Leo",
    body: "I'd love to see follow-up on the abstaining nations next month.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  }
];

export function CommentThread({ articleId }: { articleId: string }) {
  const user = useAppSelector((s) => s.auth.user);
  const [items, setItems] = useState<Comment[]>(SEED);
  const [text, setText] = useState("");

  const submit = () => {
    const body = text.trim();
    if (!body) return;
    setItems((p) => [
      {
        id: "c_" + Math.random().toString(36).slice(2),
        authorName: user?.name ?? "Guest",
        body,
        createdAt: new Date().toISOString()
      },
      ...p
    ]);
    setText("");
  };

  return (
    <section className="mt-8 rounded-2xl border bg-[rgb(var(--card))] p-5">
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-brand-600" />
        <h3 className="text-lg font-semibold">Discussion ({items.length})</h3>
      </div>
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            user ? "Add to the discussion…" : "Sign in to join the discussion"
          }
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={!user}
        />
        <Button onClick={submit} disabled={!user || !text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((c) => (
          <li key={c.id} className="flex gap-3">
            <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
              {c.authorName.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{c.authorName}</span>
                <span className="text-[11px] text-neutral-500">
                  {timeAgo(c.createdAt)}
                </span>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {c.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] text-neutral-400">
        Comments live in-session only — no backend.
      </p>
    </section>
  );
}
