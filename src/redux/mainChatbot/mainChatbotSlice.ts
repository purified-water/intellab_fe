import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatbotHistoryDetailType, ChatbotMessageContentType } from "./mainChatbotType";

interface ChatState {
  chatDetail: ChatbotHistoryDetailType | null;
}

const initialState: ChatState = {
  chatDetail: {
    thread_id: null,
    timestamp: "",
    messages: []
  }
};

const mainChatbotSlice = createSlice({
  name: "mainChatbot",
  initialState,
  reducers: {
    setChatDetail: (state, action: PayloadAction<ChatbotHistoryDetailType>) => {
      console.log("setChatDetail", action.payload);

      if (!state.chatDetail) {
        state.chatDetail = action.payload;
      } else {
        // Ensure previous messages are preserved
        state.chatDetail = {
          ...state.chatDetail,
          thread_id: action.payload.thread_id ?? state.chatDetail.thread_id, // Preserve thread_id
          timestamp: action.payload.timestamp ?? state.chatDetail.timestamp,
          messages: [...state.chatDetail.messages, ...action.payload.messages]
        };
      }
    },

    addMessage: (state, action: PayloadAction<ChatbotMessageContentType>) => {
      if (state.chatDetail) {
        state.chatDetail.messages.push(action.payload);
      }
    },

    updateThreadId: (state, action: PayloadAction<string>) => {
      if (state.chatDetail) {
        state.chatDetail.thread_id = action.payload;
      }
    },

    clearChatDetail: (state) => {
      state.chatDetail = {
        thread_id: null,
        timestamp: "",
        messages: []
      };
    }
  }
});

export const { setChatDetail, clearChatDetail, addMessage, updateThreadId } = mainChatbotSlice.actions;
export default mainChatbotSlice.reducer;
