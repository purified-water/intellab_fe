import { CreateCourseSchema } from "@/features/Admins/features/course/schemas";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CreateCourseSchema = {
  courseName: "",
  courseDescription: "",
  courseCategories: [],
  courseLevel: "beginner",
  courseThumbnail: "",
  courseLessons: [],
  coursePrice: 0,
  courseSummary: "",
  courseCertificate: {
    template: ""
  },
  courseMakeAvailable: false
};

const createCourseSlice = createSlice({
  name: "createCourse",
  initialState,
  reducers: {
    // Use partial type to allow partial updates for each steps
    setCreateCourse: (state, action: PayloadAction<Partial<CreateCourseSchema>>) => {
      return { ...state, ...action.payload };
    },
    resetCreateCourse: () => initialState
  }
});

export const { setCreateCourse, resetCreateCourse } = createCourseSlice.actions;
export default createCourseSlice.reducer;
