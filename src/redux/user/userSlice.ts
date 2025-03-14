import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userType";

const initialState: UserState = {
  user: null
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
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

// Selector to get userId from Redux store
export const selectUserId = (state: { user: UserState }) => state.user.user?.userId || null; // For getting faster userId
