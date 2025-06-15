import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userType";

const initialState: UserState = {
  user: null,
  point: 0,
  loginStreak: 0,
  loginStreakLastFetched: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    increaseCompletedCourseCount(state) {
      if (state.user) {
        state.user.courseCount! += 1;
      }
    },
    setEmailVerified(state) {
      if (state.user) {
        state.user.isEmailVerified = true;
      }
    },
    setPoint(state, action) {
      state.point = action.payload;
    },
    setLoginStreak(state, action) {
      state.loginStreak = action.payload as number;
      state.loginStreakLastFetched = new Date().toISOString();
    },
    clearLoginStreak(state) {
      state.loginStreak = null;
      state.loginStreakLastFetched = null;
    }
  }
});

export const {
  setUser,
  clearUser,
  increaseCompletedCourseCount,
  setEmailVerified,
  setPoint,
  setLoginStreak,
  clearLoginStreak
} = userSlice.actions;
export default userSlice.reducer;

// Selector to get userId from Redux store
export const selectUserId = (state: { user: UserState }) => state.user.user?.userId || null; // For getting faster userId
