"use client";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/cn";

type Toast = { id: string; message: string; tone: "info" | "success" | "error" };
type Ctx = { toast: (message: string, tone?: Toast["tone"]) => void };

const ToastContext = createContext<Ctx | null>(null);

export function useToast() {
  const v = useContext(ToastContext);
  if (!v) throw new Error("useToast must be used within ToastProvider");
  return v;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const toast = useCallback((message: string, tone: Toast["tone"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto rounded-lg border bg-[rgb(var(--card))] px-4 py-2 text-sm shadow-lg animate-fade-in",
              t.tone === "success" && "border-green-500/40",
              t.tone === "error" && "border-red-500/40"
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
