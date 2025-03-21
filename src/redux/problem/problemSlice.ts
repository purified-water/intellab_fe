import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ProblemState, UserCodeState } from "./problemType";
import { problemAPI } from "@/lib/api/problemApi";
import { Problem } from "@/features/Problem/types";
import { TCategory } from "@/types";

// Async thunk for fetching paginated problems
interface FetchPaginatedProblemsParams {
  keyword: string;
  page: number;
  size: number;
  selectedCategories: TCategory[] | null;
  status: boolean | null;
  level: string | null;
}

export const fetchPaginatedProblems = createAsyncThunk(
  "problems/fetchPaginated",
  async ({ keyword, page, size, selectedCategories, status, level }: FetchPaginatedProblemsParams, thunkAPI) => {
    const categoryIds: number[] = selectedCategories?.map((category) => category.categoryId) || [];
    try {
      const response = await problemAPI.getProblems(keyword, page, size, categoryIds, level, status);

      return response.result; // Assume the API returns { data: [...], totalPages: 5 }
    } catch {
      console.log("Failed to fetch problems");
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

const initialState: ProblemState = {
  problems: [],
  status: "idle",
  currentPage: 0,
  totalPages: 0,
  pageSize: 10, // Default page size
  exploreProblems: [],
  originalExploreProblems: [],
  hasFilter: false
};

// Slice
const problemSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },

    resetFilters: (state) => {
      state.exploreProblems = state.originalExploreProblems; // Reset to the original list
      state.hasFilter = false;
    },

    setExploreProblems: (state, action: PayloadAction<Problem[]>) => {
      state.exploreProblems = action.payload; // Display the same data initially
    },

    filterProblems: (
      state
      // action: PayloadAction<{
      //   // select edLevel: string;
      // }>
    ) => {
      // const { selectedLevel } = action.payload;

      // state.problems = state.problems.filter((problem) => {
      //   const matchLevels = selectedLevel == problem.level;
      //   return matchLevels;
      // });
      if (state.problems.length === state.originalExploreProblems.length) {
        state.hasFilter = false;
      } else {
        state.hasFilter = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaginatedProblems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPaginatedProblems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.problems = action.payload.content;
        if (!state.hasFilter) {
          state.originalExploreProblems = state.problems;
        }
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPaginatedProblems.rejected, (state) => {
        state.status = "failed";
      });
  }
});

const initialUserCodeState: UserCodeState = {
  codeByProblemId: {} // Structure: { problemId: { code: "userCode", language: "language" } }
};

// New slice for user code
const userCodeSlice = createSlice({
  name: "userCode",
  initialState: initialUserCodeState,
  reducers: {
    saveCode: (state, action) => {
      const { problemId, code, language } = action.payload;
      state.codeByProblemId[problemId] = { code, language };
    }
  }
});

// Selector to retrieve the code by problemId
export const selectCodeByProblemId = (state: { userCode: UserCodeState }, problemId: string) =>
  state.userCode.codeByProblemId[problemId] || { code: "", language: "" };

export const { setPage, filterProblems } = problemSlice.actions;
export const { saveCode } = userCodeSlice.actions;
export const userCodeReducer = userCodeSlice.reducer;

export default problemSlice.reducer;
