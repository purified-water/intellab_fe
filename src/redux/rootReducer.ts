import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/auth/authSlice";
import courseReducer from "@/redux/course/courseSlice";
import problemReducer from "@/redux/problem/problemSlice";
import userReducer from "@/redux/user/userSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  course: courseReducer,
  problem: problemReducer,
  user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
