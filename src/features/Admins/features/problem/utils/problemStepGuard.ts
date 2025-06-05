import { RootState } from "@/redux/rootReducer";

// "!!" is used to convert the value to a boolean, the function has to return a boolean
// rather than null/undefined
export const isGeneralStepValid = (state: RootState): boolean => {
  return !!(
    (
      state.createProblem.problemName &&
      state.createProblem.problemCategories.length > 0 &&
      state.createProblem.problemLevel &&
      state.createProblem.problemScore
    )
    //&& state.createProblem.problemIsPublished
  );
};

export const isDescriptionStepValid = (state: RootState): boolean => {
  return !!state.createProblem.problemDescription;
};

export const isBoilerplateStepValid = (state: RootState): boolean => {
  return !!(
    state.createProblem.problemStructure!.functionName &&
    state.createProblem.problemStructure!.inputStructure.length > 0 &&
    state.createProblem.problemStructure!.outputStructure.length > 0
  );
};

export const isTestcasesStepValid = (state: RootState): boolean => {
  return state.createProblem.problemTestcases.length > 0;
};

export const isSolutionStepValid = (state: RootState): boolean => {
  return !!state.createProblem.problemSolution;
};
