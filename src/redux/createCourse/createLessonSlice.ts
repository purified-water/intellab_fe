import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateLessonSchema } from "@/features/Admins/features/course/schemas";

const initialState: CreateLessonSchema = {
  lessonName: "",
  lessonDescription: "",
  lessonContent: "",
  lessonId: "",
  lessonOrder: 0,
  hasQuiz: false,
  lessonQuiz: undefined,
  hasProblem: false,
  lessonProblemId: undefined
};

const createLessonSlice = createSlice({
  name: "createLesson",
  initialState,
  reducers: {
    setCreateLesson: (state, action: PayloadAction<Partial<CreateLessonSchema>>) => {
      return { ...state, ...action.payload };
    },
    resetCreateLesson: () => initialState
  }
});

export const { setCreateLesson, resetCreateLesson } = createLessonSlice.actions;
export default createLessonSlice.reducer;
