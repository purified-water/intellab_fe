import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationType } from "@/features/Notification/types/NotificationType";
import { notificationAPI } from "@/lib/api/notificationAPI";
import { RootState } from "../rootReducer";

interface NotificationState {
  list: NotificationType[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: NotificationState = {
  list: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0
};

// Thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async ({ page = 0, size = 10 }: { page: number; size: number }, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.getNotifications(page, size);
      // Set the current page and total pages in the state
      const { number: currentPage, totalPages } = response.result;
      return { ...response.result, currentPage, totalPages };
      return response.result; // assuming it includes totalPages and content
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<NotificationType>) {
      state.list.unshift(action.payload);
    },
    setNotifications(state, action: PayloadAction<NotificationType[]>) {
      state.list = action.payload;
    },
    markOneAsRead(state, action: PayloadAction<string>) {
      const notificationId = action.payload;
      const notificationIndex = state.list.findIndex((notification) => notification.id === notificationId);
      if (notificationIndex !== -1) {
        state.list[notificationIndex].markAsRead = true;
      }
    },
    markAllAsRead(state) {
      state.list = state.list.map((notification) => ({
        ...notification,
        markAsRead: true
      }));
    },
    clearNotifications(state) {
      state.list = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const existingIds = new Set(state.list.map((notif) => notif.id));
        // Filter out duplicates
        const newUniqueNotifs = action.payload.content.filter((notif: NotificationType) => !existingIds.has(notif.id));
        state.list = [...newUniqueNotifs, ...state.list];
        state.currentPage = action.payload.number; // Current page
        state.totalPages = action.payload.totalPages; // Total pages
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectHasUnread = (state: RootState) => state.notifications.list.some((notif) => !notif.markAsRead);

export const { addNotification, markOneAsRead, markAllAsRead, setNotifications, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
