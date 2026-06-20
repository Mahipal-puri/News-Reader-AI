import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Role, User } from "@/types";

type AuthState = {
  user: User | null;
  role: Role;
  hydrated: boolean;
};

const initialState: AuthState = {
  user: null,
  role: "guest",
  hydrated: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.role = action.payload.role;
    },
    setRole(state, action: PayloadAction<Role>) {
      state.role = action.payload;
      if (state.user) state.user.role = action.payload;
    },
    signOut(state) {
      state.user = null;
      state.role = "guest";
    },
    markHydrated(state) {
      state.hydrated = true;
    }
  }
});

export const { setUser, setRole, signOut, markHydrated } = authSlice.actions;
export default authSlice.reducer;
