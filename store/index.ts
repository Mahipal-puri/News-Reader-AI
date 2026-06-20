import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { newsApi } from "./api/newsApi";
import authReducer from "./slices/authSlice";
import bookmarksReducer from "./slices/bookmarksSlice";
import preferencesReducer from "./slices/preferencesSlice";
import notificationsReducer from "./slices/notificationsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      bookmarks: bookmarksReducer,
      preferences: preferencesReducer,
      notifications: notificationsReducer,
      [newsApi.reducerPath]: newsApi.reducer
    },
    middleware: (gDM) => gDM().concat(newsApi.middleware)
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const enableListeners = setupListeners;
