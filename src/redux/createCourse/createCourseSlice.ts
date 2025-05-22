import { CreateCourseSchemaWithCurrentStep } from "@/features/Admins/features/course/schemas";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CREATE_COURSE_STEP_NUMBERS } from "@/features/Admins/features/course/constants";

export const initialState: CreateCourseSchemaWithCurrentStep = {
  courseId: "",
  courseName: "",
  courseDescription: "",
  courseCategories: [],
  courseLevel: "Beginner",
  courseThumbnail: null,
  courseLessons: [],
  coursePrice: 0,
  courseSummary: "",
  courseCertificate: 1,
  courseMakeAvailable: false,
  currentCreationStep: CREATE_COURSE_STEP_NUMBERS.GENERAL
};

const createCourseSlice = createSlice({
  name: "createCourse",
  initialState,
  reducers: {
    // Use partial type to allow partial updates for each steps
    setCreateCourse: (state, action: PayloadAction<Partial<CreateCourseSchemaWithCurrentStep>>) => {
      return { ...state, ...action.payload };
    },
    updateLessonQuiz: (
      state,
      action: PayloadAction<{
        lessonId: string;
        lessonQuiz: CreateCourseSchemaWithCurrentStep["courseLessons"][number]["lessonQuiz"];
      }>
    ) => {
      const index = state.courseLessons.findIndex((l) => l.lessonId === action.payload.lessonId);
      if (index !== -1) {
        state.courseLessons[index].lessonQuiz = action.payload.lessonQuiz;
      }
    },
    deleteLesson: (state, action: PayloadAction<string>) => {
      // Filter out the lesson with the given lessonId
      state.courseLessons = state.courseLessons.filter((lesson) => lesson.lessonId !== action.payload);
    },
    resetCreateCourse: () => initialState,

    setCurrentCreationStep: (state, action: PayloadAction<number>) => {
      state.currentCreationStep = action.payload;
    }
  }
});

export const { setCreateCourse, deleteLesson, updateLessonQuiz, resetCreateCourse, setCurrentCreationStep } =
  createCourseSlice.actions;
export default createCourseSlice.reducer;
