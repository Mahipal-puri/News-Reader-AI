"use client";
import Link from "next/link";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { useGetNotificationsQuery } from "@/store/api/newsApi";
import { useAppDispatch, useAppSelector } from "@/store";
import { dismiss, markAllRead } from "@/store/slices/notificationsSlice";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/cn";

const TYPE_BADGE: Record<string, string> = {
  breaking: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  category: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
  topic: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  daily: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  weekly: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
};

export default function NotificationsPage() {
  const { data, isLoading } = useGetNotificationsQuery();
  const pushed = useAppSelector((s) => s.notifications.pushed);
  const dismissed = useAppSelector((s) => s.notifications.dismissed);
  const dispatch = useAppDispatch();

  const seeded = data?.notifications ?? [];
  const items = [...pushed, ...seeded].filter((n) => !dismissed.includes(n.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Notifications</h1>
          <p className="text-sm text-neutral-500">
            Breaking news, daily briefings, and topic alerts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => dispatch(markAllRead())}>
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              Manage alerts
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl skeleton" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="You're all caught up"
          description="You'll see breaking news and daily briefings here."
          icon={<BellOff className="h-8 w-8" />}
        />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li
              key={n.id}
              className={cn(
                "flex gap-3 rounded-2xl border bg-[rgb(var(--card))] p-4",
                !n.read && "border-brand-300/40 dark:border-brand-700/40"
              )}
            >
              <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/40">
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase",
                      TYPE_BADGE[n.type]
                    )}
                  >
                    {n.type}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
                <p className="mt-1 font-medium">{n.title}</p>
                <p className="text-sm text-neutral-500">{n.body}</p>
                {n.articleId && (
                  <Link
                    href={`/article/${n.articleId}`}
                    className="mt-1 inline-block text-xs text-brand-600 hover:underline"
                  >
                    Open article →
                  </Link>
                )}
              </div>
              <button
                onClick={() => dispatch(dismiss(n.id))}
                className="rounded-md px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
