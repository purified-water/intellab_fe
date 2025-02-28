import axios from "axios";
import { ChatbotMessageInputType } from "@/features/MainChatBot/types/ChatbotMessageType";

const BASE_URL = "http://localhost:8006"; // Wait for AI service to connect with API gateway

export const aiAPI = {
  // *********** //
  // AI SUMMARY  //
  // *********** //
  getSummaryContent: async (courseName: string, courseId: string, regenereate: "true" | "false") => {
    const bodyParams = {
      message: `course name: ${courseName}, id: ${courseId}, regenerate: ${regenereate}`,
      modal: "groq-llama-3.3-70b"
    };
    const response = await axios.post(`${BASE_URL}/summarize-assistant/invoke`, bodyParams);
    return response.data;
  },

  getPDFSummaryFile: async () => {
    const response = await axios.get(`${BASE_URL}/pdf-summarization`, {
      responseType: "arraybuffer" // Important for binary data like PDFs
    });
    return response;
  },

  // ************ //
  // MAIN CHATBOT //
  // ************ //
  postMainChatbotMessage: async (
    message: string,
    model: string = "llama3.2",
    userId: string,
    thread_id?: string | null
  ) => {
    const bodyParams: ChatbotMessageInputType  = {
      message: message,
      model: model,
      user_id: userId
    };
    if (thread_id) {
      bodyParams.thread_id = thread_id;
    }
    const response = await axios.post(`${BASE_URL}/global_chatbot/invoke`, bodyParams);
    return response.data;
  },
  postGenerateTitle: async (message: string, userId: string, threadId: string) => {
    const response = await axios.post(`${BASE_URL}/title_generator/invoke`, {
      message: message,
      user_id: userId,
      thread_id: threadId
    });
    return response.data;
  },
  getThreadsHistory: async (userId: string) => {
    const response = await axios.get(`${BASE_URL}/conversations/${userId}/threads`);
    return response.data;
  },
  getThreadDetails: async (userId: string, threadId: string) => {
    const response = await axios.get(`${BASE_URL}/conversations/${userId}/thread/${threadId}`);
    return response.data;
  }
};
