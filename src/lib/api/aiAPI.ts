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
    const bodyParams: ChatbotMessageInputType = {
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
  },
  // AI CHATBOT STREAMING DATA - SSE
  postMainChatbotMessageStream: async (
    message: string,
    model: string = "llama3.2",
    userId: string,
    thread_id?: string | null
  ) => {
    const bodyParams: ChatbotMessageInputType = {
      message: message,
      model: model,
      user_id: userId
    };
    if (thread_id) {
      bodyParams.thread_id = thread_id;
    }

    // Use Fetch API for SSE handling
    const response = await fetch(`${BASE_URL}/global_chatbot/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyParams)
    });

    if (!response.body) {
      throw new Error("Failed to establish connection for streaming.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder(); // Decode from binary to text

    async function* streamProcessor() {
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process only complete SSE events
        const events = buffer.split("\n\n"); // SSE events are separated by double newlines
        buffer = events.pop() ?? ""; // Keep the last incomplete event for next iteration

        for (const event of events) {
          if (event.startsWith("data:")) {
            try {
              const jsonStr = event.replace(/^data:\s*/, ""); // Remove 'data:' prefix
              if (jsonStr === "[DONE]") break;
              yield JSON.parse(jsonStr); // Parse the JSON object
            } catch (error) {
              console.log(error);
              console.error("Failed to parse AI response chunk:", event);
            }
          }
        }
      }

      // Handle any remaining buffer
      if (buffer.startsWith("data:")) {
        try {
          yield JSON.parse(buffer.replace(/^data:\s*/, ""));
        } catch (error) {
          console.log(error);
          console.error("Failed to parse final AI response chunk:", buffer);
        }
      }
    }

    return streamProcessor();
  }
};
