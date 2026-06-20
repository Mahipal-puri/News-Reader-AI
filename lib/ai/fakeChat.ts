import type { Article } from "@/types";

const STOP = new Set([
  "the","a","an","and","or","of","to","in","on","for","is","are","was",
  "were","be","been","by","with","at","as","that","this","these","those",
  "it","its","what","why","how","who","when","where","do","does","did",
  "you","your","my","me","i","we","they","them","there","here"
]);

const sentences = (body: string) =>
  body
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);

const tokenize = (q: string) =>
  q
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP.has(w));

export async function fakeChat(article: Article, question: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));
  const q = question.trim();
  if (!q) return "Try asking what the article is about, or who is involved.";

  const lower = q.toLowerCase();
  if (lower.includes("summar") || lower.includes("tl;dr") || lower.includes("tldr")) {
    return article.summary;
  }
  if (lower.includes("takeaway") || lower.includes("key point")) {
    return article.keyTakeaways.map((t) => "• " + t).join("\n");
  }
  if (lower.startsWith("who")) {
    return `According to this piece by ${article.authorName}, the central figures involved are tied to ${article.tags.join(", ")}.`;
  }
  if (lower.startsWith("when")) {
    return `This was published on ${new Date(article.publishedAt).toLocaleString()}.`;
  }
  if (lower.startsWith("where")) {
    return `The story sits in the ${article.category} category. Specific locations are referenced in the body.`;
  }

  const tokens = tokenize(q);
  const ranked = sentences(article.body)
    .map((s) => {
      const sLow = s.toLowerCase();
      const score = tokens.reduce((acc, t) => acc + (sLow.includes(t) ? 1 : 0), 0);
      return { s, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = ranked.find((r) => r.score > 0)?.s ?? sentences(article.body)[0];
  return `Based on this article: ${best}`;
}
