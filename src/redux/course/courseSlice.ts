import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CourseState, ReduxCourse } from "./courseType";
import { TCategory, ICourse } from "@/types";
import { apiClient } from "@/lib/api/apiClient";

const initialState: CourseState = {
  courses: [],
  exploreCourses: [],
  originalExploreCourses: [],
  hasFilter: false
};

export const fetchExploreCourses = createAsyncThunk(
  "course/fetchExploreCourses",
  async (
    payload: {
      keyword: string;
      priceFrom?: number | null;
      priceTo?: number | null;
      selectedCategories: TCategory[];
      selectedLevels: string[];
      selectedRating: string | null;
    },

    { dispatch, getState }
  ) => {
    try {
      const { keyword, selectedCategories, selectedRating, priceFrom, priceTo } = payload;
      const categoryIds = selectedCategories.map((category) => category.categoryId);

      const response = await apiClient.get("course/courses/search", {
        params: {
          keyword: keyword,
          categories: categoryIds.join(","),
          levels: payload.selectedLevels.join(","),
          priceFrom: priceFrom ? priceFrom : null,
          priceTo: priceTo ? priceTo : null,
          ratings: selectedRating ? (parseFloat(selectedRating) > 0 ? parseFloat(selectedRating) : null) : null
        }
      });

      const courses = response.data.result.content;

      // Get the current state
      const state = getState() as { course: CourseState };

      // Set the explore courses
      dispatch(courseSlice.actions.setExploreCourses(courses));

      // Check if filtering has been applied
      const hasFilter =
        courses.length !== state.course.originalExploreCourses.length ||
        (priceFrom !== null && priceFrom !== 0) ||
        (priceTo !== null && priceTo !== 1000000) ||
        selectedCategories.length > 0 ||
        (selectedRating && selectedRating !== "0");

      // Set the filter state
      dispatch(courseSlice.actions.updateFilterStatus(Boolean(hasFilter)));
    } catch (error) {
      console.error("Error fetching explore courses:", error);
      throw error;
    }
  }
);

// Slice definition
const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    resetCourseState: () => {
      // Ensure we completely reset to initial state
      return {
        ...initialState,
        hasFilter: false
      };
    },

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
    },

    getExploreCourse: (state, action: PayloadAction<ICourse[]>) => {
      state.originalExploreCourses = action.payload; // Store the original data
      state.exploreCourses = action.payload; // Display the same data initially
      state.hasFilter = false; // Reset filter state on initial load
    },

    resetFilters: (state) => {
      state.exploreCourses = state.originalExploreCourses; // Reset to the original list
      state.hasFilter = false;
    },

    setExploreCourses: (state, action: PayloadAction<ICourse[]>) => {
      // state.originalExploreCourses = action.payload;
      state.exploreCourses = action.payload; // Display the same data initially
    },

    updateFilterStatus: (state, action: PayloadAction<boolean>) => {
      state.hasFilter = action.payload;
    }
  }
});

export const {
  resetCourseState,
  updateUserEnrolled,
  addCourse,
  removeCourse,
  getExploreCourse,
  resetFilters,
  setExploreCourses,
  updateFilterStatus
} = courseSlice.actions;
export default courseSlice.reducer;
