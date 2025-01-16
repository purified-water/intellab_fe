import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./store"; // Adjust the path to your store
import { RootState } from "./rootReducer";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
