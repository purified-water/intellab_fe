import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatbotHistoryDetailType, ChatbotMessageContentType } from "./lessonChatbotType";

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

const lessonChatbotSlice = createSlice({
  name: "lessonChatbot",
  initialState,
  reducers: {
    // Reserved for setting chat detail after selecting a history item only
    setChatDetail: (state, action: PayloadAction<ChatbotHistoryDetailType>) => {
      if (!state.chatDetail) {
        state.chatDetail = action.payload;
      } else {
        // Ensure previous messages are preserved
        state.chatDetail = {
          ...state.chatDetail,
          thread_id: action.payload.thread_id ?? state.chatDetail.thread_id, // Preserve thread_id
          timestamp: action.payload.timestamp ?? state.chatDetail.timestamp,
          messages: [...action.payload.messages]
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
    // For updating a stream of content from AI
    updateLastMessageContent: (state, action: PayloadAction<string>) => {
      if (state.chatDetail?.messages.length) {
        const lastMessage = state.chatDetail.messages[state.chatDetail.messages.length - 1];
        if (lastMessage && lastMessage.type === "ai") {
          lastMessage.content = action.payload;
        }
      }
    },
    // For updating when the stream stops and return the whole message
    updateLastMessage: (state, action: PayloadAction<ChatbotMessageContentType>) => {
      if (state.chatDetail?.messages.length) {
        state.chatDetail.messages[state.chatDetail.messages.length - 1] = action.payload;
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

export const {
  setChatDetail,
  clearChatDetail,
  addMessage,
  updateThreadId,
  updateLastMessage,
  updateLastMessageContent
} = lessonChatbotSlice.actions;
export default lessonChatbotSlice.reducer;
