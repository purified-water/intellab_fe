import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PremiumStatusState } from "./premiumStatusType";
import { TPremiumStatus } from "@/types";

const initialState: PremiumStatusState = {
  premiumStatus: null
};

const premiumStatusSlice = createSlice({
  name: "premiumStatus",
  initialState,
  reducers: {
    setPremiumStatus(state, action: PayloadAction<TPremiumStatus>) {
      state.premiumStatus = action.payload;
    },
    clearPremiumStatus(state) {
      state.premiumStatus = null;
    }
  }
});

export const { setPremiumStatus, clearPremiumStatus } = premiumStatusSlice.actions;
export default premiumStatusSlice.reducer;
