import { RootState } from "@/redux/rootReducer";

// !! is used to convert the value to a boolean, the function has to return a boolean
// rather than null/undefined
export const isGeneralStepValid = (state: RootState): boolean => {
  return !!(
    state.createCourse.courseName &&
    state.createCourse.courseDescription &&
    state.createCourse.courseCategories.length > 0 &&
    state.createCourse.courseLevel
  );
};

export const isLessonsStepValid = (state: RootState): boolean => {
  return state.createCourse.courseLessons.length > 0;
};

export const isFinalStepValid = (state: RootState): boolean => {
  return !!(
    state.createCourse.courseCertificate &&
    state.createCourse.coursePrice !== null &&
    state.createCourse.courseSummary
  );
};
