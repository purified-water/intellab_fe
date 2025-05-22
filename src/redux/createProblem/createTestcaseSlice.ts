import { CreateTestcaseSchema } from "@/features/Admins/features/problem/schemas";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CreateTestcaseSchema = {
  testcaseId: "",
  testcaseInput: "",
  expectedOutput: "",
  testcaseOrder: 0
};

const createTestcaseSlice = createSlice({
  name: "createTestcase",
  initialState,
  reducers: {
    setCreateTestcase: (state, action: PayloadAction<Partial<CreateTestcaseSchema>>) => {
      return { ...state, ...action.payload };
    },
    resetCreateTestcase: () => initialState
  }
});

export const { setCreateTestcase, resetCreateTestcase } = createTestcaseSlice.actions;
export default createTestcaseSlice.reducer;
