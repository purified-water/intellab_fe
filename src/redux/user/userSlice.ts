import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userType";

const initialState: UserState = {
  user: null,
  progress: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setProgress(state, action) {
      state.progress = action.payload;
    },
    clearUser(state) {
      state.user = null;
    }
  }
});

export const { setUser, setProgress, clearUser } = userSlice.actions;
export default userSlice.reducer;
