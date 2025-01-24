import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/auth/authSlice";
import courseReducer from "@/redux/course/courseSlice";
import problemReducer from "@/redux/problem/problemSlice";
import userReducer from "@/redux/user/userSlice";
import { userCodeReducer } from "@/redux/problem/problemSlice";
import submissionReducer from "./problem/submissionSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  course: courseReducer,
  problem: problemReducer,
  user: userReducer,
  userCode: userCodeReducer,
  submission: submissionReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
