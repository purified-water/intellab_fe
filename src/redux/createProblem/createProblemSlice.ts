import { CreateProblemSchemaWithCurrentStep } from "@/features/Admins/features/problem/schemas";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CREATE_PROBLEM_STEP_NUMBERS } from "@/features/Admins/features/problem/constants";

export const initialState: CreateProblemSchemaWithCurrentStep = {
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
  problemSolution: "",
  currentCreationStep: CREATE_PROBLEM_STEP_NUMBERS.GENERAL
};

const createProblemSlice = createSlice({
  name: "createProblem",
  initialState,
  reducers: {
    // Use partial type to allow partial updates for each steps
    setCreateProblem: (state, action: PayloadAction<Partial<CreateProblemSchemaWithCurrentStep>>) => {
      return { ...state, ...action.payload };
    },
    resetCreateProblem: () => initialState
  }
});

export const { setCreateProblem, resetCreateProblem } = createProblemSlice.actions;
export default createProblemSlice.reducer;
