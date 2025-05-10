import { CreateCourseSchema } from "@/features/Admins/features/course/schemas";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CreateCourseSchema = {
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
    updateLessonQuiz: (
      state,
      action: PayloadAction<{
        lessonId: string;
        lessonQuiz: CreateCourseSchema["courseLessons"][number]["lessonQuiz"];
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
    resetCreateCourse: () => initialState
  }
});

export const { setCreateCourse, deleteLesson, updateLessonQuiz, resetCreateCourse } = createCourseSlice.actions;
export default createCourseSlice.reducer;
