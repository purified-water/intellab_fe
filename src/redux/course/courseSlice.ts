import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CourseState, ReduxCourse } from "./courseType";

const initialState: CourseState = {
  courses: []
};

// Slice definition
const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    resetCourseState: () => initialState,

    // Update or add a course's enrollment status based on courseId
    updateUserEnrolled: (state, action: PayloadAction<{ courseId: string; isEnrolled: boolean }>) => {
      const { courseId, isEnrolled } = action.payload;
      const existingCourse = state.courses ? state.courses.find((course) => course.courseId === courseId) : null;

      if (existingCourse) {
        existingCourse.userEnrolled = isEnrolled; // Update the existing course's userEnrolled status
      } else {
        // If the course doesn't exist, add it to the courses list
        state.courses.push({
          courseId,
          userEnrolled: isEnrolled
        });
      }
    },

    // Optionally, you can handle adding/removing courses from the list
    addCourse: (state, action: PayloadAction<ReduxCourse>) => {
      state.courses.push(action.payload);
    },
    removeCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter((course) => course.courseId !== action.payload);
    }
  }
});

export const { resetCourseState, updateUserEnrolled, addCourse, removeCourse } = courseSlice.actions;
export default courseSlice.reducer;
