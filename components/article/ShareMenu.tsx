"use client";
import { useEffect, useRef, useState } from "react";
import { Link as LinkIcon, MessageCircle, Share2, Twitter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function ShareMenu({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = encodeURIComponent(`${title} — ${url}`);

  const openWindow = (href: string) => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  const copyLink = async () => {
    setOpen(false);
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied", "success");
    } catch {
      toast("Could not copy link", "error");
    }
  };

  const nativeShare = async () => {
    setOpen(false);
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, url });
      } catch {
        // user dismissed
      }
    } else {
      copyLink();
    }
  };

  return (
    <div ref={ref} className="relative inline-block">
      <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border bg-[rgb(var(--card))] shadow-[var(--shadow-3)]"
        >
          <button
            role="menuitem"
            onClick={() =>
              openWindow(`https://api.whatsapp.com/send?text=${text}`)
            }
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
              <MessageCircle className="h-4 w-4" />
            </span>
            WhatsApp
          </button>
          <button
            role="menuitem"
            onClick={() =>
              openWindow(`https://twitter.com/intent/tweet?text=${text}`)
            }
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
              <Twitter className="h-4 w-4" />
            </span>
            X / Twitter
          </button>
          <button
            role="menuitem"
            onClick={copyLink}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
              <LinkIcon className="h-4 w-4" />
            </span>
            Copy link
          </button>
          <button
            role="menuitem"
            onClick={nativeShare}
            className="flex w-full items-center gap-3 border-t px-3 py-2.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white">
              <Share2 className="h-4 w-4" />
            </span>
            More…
          </button>
        </div>
      )}
    </div>
  );
}
