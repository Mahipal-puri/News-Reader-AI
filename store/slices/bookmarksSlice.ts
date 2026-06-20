import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type BookmarksState = {
  ids: string[];
  collections: Record<string, string[]>;
  likes: string[];
};

const initialState: BookmarksState = {
  ids: [],
  collections: { "Reading List": [] },
  likes: []
};

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    hydrate(_, action: PayloadAction<BookmarksState>) {
      return action.payload;
    },
    toggleBookmark(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id);
        for (const key of Object.keys(state.collections)) {
          state.collections[key] = state.collections[key].filter((x) => x !== id);
        }
      } else {
        state.ids.unshift(id);
      }
    },
    toggleLike(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.likes = state.likes.includes(id)
        ? state.likes.filter((x) => x !== id)
        : [...state.likes, id];
    },
    createCollection(state, action: PayloadAction<string>) {
      const name = action.payload.trim();
      if (name && !state.collections[name]) state.collections[name] = [];
    },
    addToCollection(
      state,
      action: PayloadAction<{ collection: string; articleId: string }>
    ) {
      const { collection, articleId } = action.payload;
      if (!state.collections[collection]) state.collections[collection] = [];
      if (!state.collections[collection].includes(articleId))
        state.collections[collection].push(articleId);
      if (!state.ids.includes(articleId)) state.ids.unshift(articleId);
    },
    removeFromCollection(
      state,
      action: PayloadAction<{ collection: string; articleId: string }>
    ) {
      const { collection, articleId } = action.payload;
      if (state.collections[collection])
        state.collections[collection] = state.collections[collection].filter(
          (x) => x !== articleId
        );
    }
  }
});

export const {
  hydrate,
  toggleBookmark,
  toggleLike,
  createCollection,
  addToCollection,
  removeFromCollection
} = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
