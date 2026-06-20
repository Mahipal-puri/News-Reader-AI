import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LanguageCode } from "@/lib/languages";

export type AccentColor = "blue" | "violet" | "rose" | "emerald" | "amber" | "teal";

type PreferencesState = {
  followedTopics: string[];
  followedPublishers: string[];
  locale: LanguageCode;
  accentColor: AccentColor;
  voiceSpeed: number;
  notifications: {
    breaking: boolean;
    daily: boolean;
    weekly: boolean;
    categories: Record<string, boolean>;
  };
};

const initialState: PreferencesState = {
  followedTopics: ["technology", "science", "business"],
  followedPublishers: [],
  locale: "en",
  accentColor: "blue",
  voiceSpeed: 1,
  notifications: {
    breaking: true,
    daily: true,
    weekly: false,
    categories: { technology: true, science: true }
  }
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    hydrate(_, action: PayloadAction<PreferencesState>) {
      return { ...initialState, ...action.payload };
    },
    toggleTopic(state, action: PayloadAction<string>) {
      const t = action.payload;
      state.followedTopics = state.followedTopics.includes(t)
        ? state.followedTopics.filter((x) => x !== t)
        : [...state.followedTopics, t];
    },
    togglePublisher(state, action: PayloadAction<string>) {
      const p = action.payload;
      state.followedPublishers = state.followedPublishers.includes(p)
        ? state.followedPublishers.filter((x) => x !== p)
        : [...state.followedPublishers, p];
    },
    setLocale(state, action: PayloadAction<LanguageCode>) {
      state.locale = action.payload;
    },
    setAccentColor(state, action: PayloadAction<AccentColor>) {
      state.accentColor = action.payload;
    },
    setVoiceSpeed(state, action: PayloadAction<number>) {
      state.voiceSpeed = action.payload;
    },
    setNotificationFlag(
      state,
      action: PayloadAction<{ key: "breaking" | "daily" | "weekly"; value: boolean }>
    ) {
      state.notifications[action.payload.key] = action.payload.value;
    },
    setCategoryAlert(
      state,
      action: PayloadAction<{ category: string; value: boolean }>
    ) {
      state.notifications.categories[action.payload.category] = action.payload.value;
    }
  }
});

export const {
  hydrate: hydratePreferences,
  toggleTopic,
  togglePublisher,
  setLocale,
  setAccentColor,
  setVoiceSpeed,
  setNotificationFlag,
  setCategoryAlert
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
