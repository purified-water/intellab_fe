import { CreateProblemSchema } from "@/features/Admins/features/problem/schemas";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CreateProblemSchema = {
  problemId: "",
  problemName: "",
  problemCategories: [],
  problemLevel: "Easy",
  problemScore: 0,
  problemIsPublished: false,
  problemDescription: "",
  problemStructure: {
    functionName: "",
    inputStructure: [],
    outputStructure: []
  },
  problemTestcases: [],
  problemSolution: ""
};

const createProblemSlice = createSlice({
  name: "createProblem",
  initialState,
  reducers: {
    // Use partial type to allow partial updates for each steps
    setCreateProblem: (state, action: PayloadAction<Partial<CreateProblemSchema>>) => {
      return { ...state, ...action.payload };
    },
    resetCreateProblem: () => initialState
  }
});

export const { setCreateProblem, resetCreateProblem } = createProblemSlice.actions;
export default createProblemSlice.reducer;
