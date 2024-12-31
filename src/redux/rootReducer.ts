import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/auth/authSlice";
import courseReducer from "@/redux/course/courseSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  course: courseReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
