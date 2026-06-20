import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "@/types";

type State = {
  pushed: Notification[];
  dismissed: string[];
};

const initialState: State = { pushed: [], dismissed: [] };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    push(state, action: PayloadAction<Notification>) {
      state.pushed.unshift(action.payload);
    },
    dismiss(state, action: PayloadAction<string>) {
      state.dismissed.push(action.payload);
    },
    markAllRead(state) {
      state.pushed = state.pushed.map((n) => ({ ...n, read: true }));
    },
    clearAll(state) {
      state.pushed = [];
      state.dismissed = [];
    }
  }
});

export const { push, dismiss, markAllRead, clearAll } = notificationsSlice.actions;
export default notificationsSlice.reducer;
