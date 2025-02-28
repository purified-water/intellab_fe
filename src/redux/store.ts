import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import rootReducer from "@/redux/rootReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "course", "problem", "user", "submission", "comment"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // Required for redux-persist
    })
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export default store;
