import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CourseState, ReduxCourse } from "./courseType";
import { ICourse } from "@/features/Course/types";
import { PriceRange } from "@/pages/ExplorePage/components/FilterComponent";
import { apiClient } from "@/lib/api/apiClient";
import { ICategory } from "@/pages/HomePage/types/responseTypes";

const initialState: CourseState = {
  courses: [],
  exploreCourses: [],
  originalExploreCourses: [],
  hasFilter: false
};

// Async thunk để gọi API
export const fetchExploreCourses = createAsyncThunk(
  "course/fetchExploreCourses",
  async (
    payload: {
      keyword: string;
      selectedCategories: ICategory[];
      selectedRating: string | null;
      selectedPrices: string[];
    },

    { dispatch }
  ) => {
    try {
      const { keyword, selectedCategories, selectedRating, selectedPrices } = payload;
      const categoryIds = selectedCategories.map((category) => category.categoryId);
      // Gọi API với danh sách courseId được chọn
      const response = await apiClient.get("course/courses/search", {
        params: {
          keyword: keyword,
          categories: categoryIds.join(","),
          ratings: selectedRating ? (parseFloat(selectedRating) > 0 ? parseFloat(selectedRating) : null) : null,
          price: selectedPrices.length === 1 && selectedPrices.some((value) => value === "Paid")
        } // Định dạng tham số truy vấn
      });

      // Kết quả trả về
      const courses = response.data.result.content;
      console.log("COURSES", courses);
      // Lưu vào state
      dispatch(courseSlice.actions.setExploreCourses(courses));
    } catch (error) {
      console.error("Lỗi khi gọi API fetchExploreCourses:", error);
      throw error;
    }
  }
);

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
    },

    getExploreCourse: (state, action: PayloadAction<ICourse[]>) => {
      state.originalExploreCourses = action.payload; // Store the original data
      state.exploreCourses = action.payload; // Display the same data initially
    },

    resetFilters: (state) => {
      state.exploreCourses = state.originalExploreCourses; // Reset to the original list
      state.hasFilter = false;
    },

    setExploreCourses: (state, action: PayloadAction<ICourse[]>) => {
      // state.originalExploreCourses = action.payload;
      state.exploreCourses = action.payload; // Display the same data initially
      console.log("Set Explore courses length", state.exploreCourses.length);
    },

    filterCourses: (
      state,
      action: PayloadAction<{
        // selectedType: string;
        // selectedStatus: string;
        // selectedCategories: string[];
        // showCertificationPrep: boolean;
        // selectedRating: string | null;
        selectedLevels: string[];
        selectedPrices: string[];
        priceRange: PriceRange;
      }>
    ) => {
      {
        /* NOTE 3/11/2024: Code comments will be utilized later on */
      }
      // const { selectedCategories, selectedRating, selectedLevels, selectedPrices, priceRange } = action.payload;
      const { selectedLevels, selectedPrices, priceRange } = action.payload;
      console.log("Explore Courses State:", state.exploreCourses);
      state.exploreCourses = state.exploreCourses.filter((course) => {
        // const matchCategories =
        //   selectedCategories.length === 0 ||
        //   selectedCategories.some((category) => {
        //     console.log("check", category, course.courseName, course.courseName.includes(category));
        //     return course.courseName.includes(category);
        //   });
        // const matchCertification = !showCertificationPrep || course.isCertificationPrep;
        // const matchRating = !selectedRating || course.averageRating >= parseFloat(selectedRating);
        const matchLevels = selectedLevels.length === 0 || selectedLevels.includes(course.level);
        const matchPrices =
          selectedPrices.length === 0 ||
          selectedPrices.some((price) => {
            if (price === "Paid") {
              if (priceRange) {
                return course.price > priceRange.min && course.price <= priceRange.max;
              }
              return course.price > 0;
            }
            if (price === "Free") {
              return course.price == 0;
            }
            return course.price >= 0;
          });
        // return matchCategories && matchRating && matchLevels && matchPrices;
        return matchLevels && matchPrices;
      });
      if (
        state.exploreCourses.length === state.originalExploreCourses.length
        // state.originalExploreCourses.length !== 0
      ) {
        state.hasFilter = false;
        console.log("Explore courses length", state.exploreCourses.length);
        console.log("Original courses length", state.originalExploreCourses.length);
      } else {
        state.hasFilter = true;
      }
    }
  }
});

export const {
  resetCourseState,
  updateUserEnrolled,
  addCourse,
  removeCourse,
  getExploreCourse,
  filterCourses,
  resetFilters
} = courseSlice.actions;
export default courseSlice.reducer;
