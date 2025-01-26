import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProblemState, UserCodeState } from "./problemType";
import { problemAPI } from "@/lib/api/problemApi";
// Async thunk for fetching paginated problems
interface FetchPaginatedProblemsParams {
  keyword: string;
  page: number;
  size: number;
}

export const fetchPaginatedProblems = createAsyncThunk(
  "problems/fetchPaginated",
  async ({ keyword, page, size }: FetchPaginatedProblemsParams, thunkAPI) => {
    try {
      const response = await problemAPI.getProblems(keyword, page, size);
      console.log("RESPONSE", response);
      return response.result; // Assume the API returns { data: [...], totalPages: 5 }
    } catch {
      console.log("ERROR");
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

const initialState: ProblemState = {
  problems: [],
  status: "idle",
  currentPage: 0,
  totalPages: 0,
  pageSize: 10 // Default page size
};

// Slice
const problemSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaginatedProblems.pending, (state) => {
        state.status = "loading";
        console.log("LOADING");
      })
      .addCase(fetchPaginatedProblems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.problems = action.payload.content;
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

export const { setPage } = problemSlice.actions;
export const { saveCode } = userCodeSlice.actions;
export const userCodeReducer = userCodeSlice.reducer;

export default problemSlice.reducer;
