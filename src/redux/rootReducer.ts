import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/auth/authSlice";
import courseReducer from "@/redux/course/courseSlice";
import problemReducer from "@/redux/problem/problemSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  course: courseReducer,
  problem: problemReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
