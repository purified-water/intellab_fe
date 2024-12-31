import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "@/redux/auth/authTypes";

const initialState: AuthState = {
  isAuthenticated: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state) {
      state.isAuthenticated = true;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
    }
  }
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
