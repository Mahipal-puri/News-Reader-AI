"use client";
import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import type { Article } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { fakeSummary } from "@/lib/ai/fakeSummary";
import { ChatWithNews } from "./ChatWithNews";
import { TranslateMenu } from "./TranslateMenu";
import { VoiceReader } from "./VoiceReader";

export function AIPanel({ article }: { article: Article }) {
  return (
    <div className="rounded-2xl border bg-[rgb(var(--card))] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-600" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          AI Assistant
        </h3>
      </div>
      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="bullets">Bullets</TabsTrigger>
          <TabsTrigger value="takeaways">Takeaways</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="translate">Translate</TabsTrigger>
          <TabsTrigger value="listen">Listen</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <SummaryView article={article} kind="short" />
        </TabsContent>
        <TabsContent value="bullets">
          <SummaryView article={article} kind="bullets" />
        </TabsContent>
        <TabsContent value="takeaways">
          <SummaryView article={article} kind="takeaways" />
        </TabsContent>
        <TabsContent value="chat">
          <ChatWithNews article={article} />
        </TabsContent>
        <TabsContent value="translate">
          <TranslateMenu article={article} />
        </TabsContent>
        <TabsContent value="listen">
          <VoiceReader article={article} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SummaryView({
  article,
  kind
}: {
  article: Article;
  kind: "short" | "bullets" | "takeaways";
}) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | string[] | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setResult(null);
    fakeSummary(article, kind).then((r) => {
      if (alive) {
        setResult(r);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [article, kind]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-neutral-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Generating…
      </div>
    );
  }
  if (Array.isArray(result)) {
    return (
      <ul className="space-y-2 text-sm leading-relaxed">
        {result.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-brand-600">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    );
  }
  return <p className="text-sm leading-relaxed">{result}</p>;
}
