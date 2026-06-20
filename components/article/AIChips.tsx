import { cn } from "@/lib/cn";
import type { Sentiment } from "@/types";

const sentimentTone: Record<Sentiment, string> = {
  positive: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  negative: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
};

function biasLabel(score: number) {
  if (score <= -0.15) return { label: "Left-lean", tone: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" };
  if (score >= 0.15) return { label: "Right-lean", tone: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" };
  return { label: "Balanced", tone: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" };
}

export function AIChips({
  sentiment,
  biasScore
}: {
  sentiment: Sentiment;
  biasScore: number;
}) {
  const bias = biasLabel(biasScore);
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
          sentimentTone[sentiment]
        )}
      >
        {sentiment}
      </span>
      <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", bias.tone)}>
        {bias.label}
      </span>
    </div>
  );
}
