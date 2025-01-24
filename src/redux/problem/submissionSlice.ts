import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubmissionTypeNoProblem } from "@/features/Problem/types/SubmissionType";

interface SubmissionState {
  submissions: Record<string, SubmissionTypeNoProblem>; // Store submissions keyed by problemId
}

const initialState: SubmissionState = {
  submissions: {}
};

const submissionSlice = createSlice({
  name: "submission",
  initialState,
  reducers: {
    saveSubmission: (state, action: PayloadAction<{ problemId: string; updateResponse: any }>) => {
      const { problemId, updateResponse } = action.payload;
      state.submissions[problemId] = updateResponse;
    },
    clearSubmission: (state, action: PayloadAction<string>) => {
      const problemId = action.payload;
      delete state.submissions[problemId];
    }
  }
});

// Export actions and reducer
export const { saveSubmission, clearSubmission } = submissionSlice.actions;
export const submissionReducer = submissionSlice.reducer;
export default submissionReducer;
