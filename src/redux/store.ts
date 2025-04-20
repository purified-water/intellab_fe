import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import rootReducer from "@/redux/rootReducer";
import { useDispatch } from "react-redux";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "course", "problem", "user", "submission", "comment", "mainChatbot", "premiumStatus"] // Add the slices you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // Required for redux-persist
    })
});

// Persistor setup
export const persistor = persistStore(store);

// Custom hook for dispatch
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
