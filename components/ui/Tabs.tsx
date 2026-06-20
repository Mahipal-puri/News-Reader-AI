"use client";
import { ReactNode, createContext, useContext, useState } from "react";
import { cn } from "@/lib/cn";

type Ctx = { value: string; setValue: (v: string) => void };
const TabsCtx = createContext<Ctx | null>(null);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className
}: {
  defaultValue: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const v = value ?? internal;
  const set = (nv: string) => {
    setInternal(nv);
    onValueChange?.(nv);
  };
  return (
    <TabsCtx.Provider value={{ value: v, setValue: set }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="tablist"
      className={cn(
        "no-scrollbar flex gap-1 overflow-x-auto rounded-xl border bg-[rgb(var(--card))] p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children
}: {
  value: string;
  children: ReactNode;
}) {
  const ctx = useContext(TabsCtx);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => ctx.setValue(value)}
      className={cn(
        "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors",
        active
          ? "bg-brand-600 text-white"
          : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsCtx);
  if (!ctx || ctx.value !== value) return null;
  return <div className="mt-4 animate-fade-in">{children}</div>;
}
