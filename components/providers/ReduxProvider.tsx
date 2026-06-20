"use client";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store";
import { markHydrated, setUser } from "@/store/slices/authSlice";
import { hydrate as hydrateBookmarks } from "@/store/slices/bookmarksSlice";
import { hydratePreferences } from "@/store/slices/preferencesSlice";
import { AccentSync } from "./AccentSync";

const KEYS = {
  auth: "nr.auth.v1",
  bookmarks: "nr.bookmarks.v1",
  preferences: "nr.preferences.v1"
} as const;

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) storeRef.current = makeStore();
  const store = storeRef.current;

  useEffect(() => {
    try {
      const a = localStorage.getItem(KEYS.auth);
      if (a) {
        const parsed = JSON.parse(a);
        if (parsed?.user) store.dispatch(setUser(parsed.user));
      }
      const b = localStorage.getItem(KEYS.bookmarks);
      if (b) store.dispatch(hydrateBookmarks(JSON.parse(b)));
      const p = localStorage.getItem(KEYS.preferences);
      if (p) store.dispatch(hydratePreferences(JSON.parse(p)));
    } catch {
      // ignore corrupted state
    } finally {
      store.dispatch(markHydrated());
    }

    const unsub = store.subscribe(() => {
      const s = store.getState();
      try {
        localStorage.setItem(
          KEYS.auth,
          JSON.stringify({ user: s.auth.user })
        );
        localStorage.setItem(KEYS.bookmarks, JSON.stringify(s.bookmarks));
        localStorage.setItem(KEYS.preferences, JSON.stringify(s.preferences));
      } catch {
        // quota or private-mode — ignore
      }
    });
    return () => unsub();
  }, [store]);

  return (
    <Provider store={store}>
      <AccentSync />
      {children}
    </Provider>
  );
}
