"use client";
import { useEffect } from "react";
import { useAppSelector } from "@/store";

export function AccentSync() {
  const accent = useAppSelector((s) => s.preferences.accentColor);
  useEffect(() => {
    const html = document.documentElement;
    if (accent === "blue") html.removeAttribute("data-accent");
    else html.setAttribute("data-accent", accent);
  }, [accent]);
  return null;
}
