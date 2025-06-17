import { apiClient } from "./apiClient";
import { ChatbotMessageInputType } from "@/features/MainChatBot/types/ChatbotMessageType";
import { AI_AGENT } from "@/constants";
import { ChatbotHistoryItemType, ChatTitleGeneratorPayload } from "@/features/MainChatBot/types";
import { removeChatTitleQuotes } from "@/utils";

export const aiAPI = {
  // *********** //
  // AI SUMMARY  //
  // *********** //
  getCourseSummary: async (courseName: string, courseId: string, regenereate: "true" | "false") => {
    const bodyParams = {
      message: `course name: ${courseName}, id: ${courseId}, regenerate: ${regenereate}`,
      model: "qwen3-14b"
    };
    const response = await apiClient.post(`/ai/invoke/${AI_AGENT.SUMMARIZE_ASSISTANT}`, bodyParams);
    return response.data;
  },

  getCourseSummaryStream: async (
    courseName: string,
    courseId: string,
    userId: string,
    regenerate: "true" | "false",
    controller: AbortController // Added controller parameter
  ) => {
    const bodyParams = {
      message: `course name: ${courseName}, id: ${courseId}, regenerate: ${regenerate}`,
      user_id: userId,
      model: "qwen3-14b"
    };

    try {
      // Use apiClient to prepare the request URL and headers
      const url = `${apiClient.defaults.baseURL}/ai/stream/${AI_AGENT.SUMMARIZE_ASSISTANT}`;
      // const headers = Object.fromEntries(
      //   Object.entries(apiClient.defaults.headers.common)
      //     .filter(([, value]) => value != null) // Remove null or undefined values
      //     .map(([key, value]) => [key, String(value)]) // Ensure all values are strings
      // );
      // headers["Content-Type"] = "application/json";
      const headers = {
        ...apiClient.defaults.headers.common, // Include common headers from apiClient
        "Content-Type": "application/json"
      };

      // Ensure the Authorization header is explicitly included
      if (!headers["Authorization"]) {
        const token = localStorage.getItem("accessToken"); // Replace with your token retrieval logic
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      // Use fetch for streaming response
      const response = await fetch(url, {
        method: "POST",
        headers: Object.fromEntries(Object.entries(headers).map(([key, value]) => [key, String(value)])),
        body: JSON.stringify(bodyParams),
        signal: controller.signal // Attach signal to fetch request
      });

      if (!response.body) {
        throw new Error("Failed to establish connection for streaming.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      async function* streamProcessor() {
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            if (event.startsWith("data:")) {
              try {
                const jsonStr = event.replace(/^data:\s*/, "");
                if (jsonStr === "[DONE]") {
                  reader.cancel();
                  return;
                }
                yield JSON.parse(jsonStr);
              } catch (error) {
                console.log("Failed to parse AI response chunk:", error);
                console.error("Failed to parse AI response chunk with event:", event);
              }
            }
          }
        }

        if (buffer.startsWith("data:")) {
          try {
            yield JSON.parse(buffer.replace(/^data:\s*/, ""));
          } catch (error) {
            console.log("Failed to parse final AI response chunk:", error);
            console.error("Failed to parse final AI response chunk at buffer:", buffer);
          }
        }
      }

      return streamProcessor();
    } catch (error) {
      console.log("Failed to establish connection for streaming:", error);
      return;
    }
  },

  getPDFSummaryFile: async () => {
    const response = await apiClient.get(`/ai/${AI_AGENT.PDF_SUMMARY}`, {
      responseType: "arraybuffer" // Important for binary data like PDFs
    });
    return response;
  },

  // ************************************************//
  //  AI MAIN CHATBOT/PROBLEM ASSISTANT - REQUESTS   //
  // ************************************************//
  postChatbotMessage: async (
    agent: "global_chatbot" | "problem_chatbot",
    message: string,
    model: string = "llama3.2",
    userId: string,
    threadId?: string | null
  ) => {
    const bodyParams: ChatbotMessageInputType = {
      message: message,
      model: model,
      user_id: userId
    };
    if (threadId) {
      bodyParams.thread_id = threadId;
    }
    const response = await apiClient.post(`/ai/invoke/${agent}`, bodyParams);
    return response.data;
  },
  postGenerateTitle: async (
    agent: "global_chatbot" | "problem_chatbot",
    message: string,
    userId: string,
    threadId: string,
    problemId?: string
  ) => {
    const bodyParams: ChatTitleGeneratorPayload = {
      message: message,
      user_id: userId,
      thread_id: threadId
    };

    if (agent === "problem_chatbot") {
      if (!problemId) {
        throw new Error("Problem ID is required for problem chatbot.");
      }
      bodyParams.problem_title = "1"; // 1 means its calling the title generator for problem chatbot
      bodyParams.problem_id = problemId;
    }

    const response = await apiClient.post(`/ai/invoke/${AI_AGENT.TITLE_GENERATOR}`, bodyParams);
    return response.data;
  },
  getThreadsHistory: async (userId: string) => {
    const response = await apiClient.get(`/ai/conversation/${userId}/threads`);
    // Remove quotes from chat title
    response.data.data.map((thread: ChatbotHistoryItemType) => {
      thread.title = removeChatTitleQuotes(thread.title);
    });
    return response.data;
  },
  getThreadDetails: async (userId: string, threadId: string) => {
    const response = await apiClient.get(`/ai/conversation/${userId}/thread/${threadId}`);
    return response.data;
  },
  // AI MAIN CHATBOT/PROBLEM ASSISTANT STREAMING DATA - SSE
  postChatbotMessageStream: async (
    agent: "global_chatbot" | "problem_chatbot" | "lesson_chatbot",
    message: string,
    model: string = "llama3.2",
    userId: string,
    controller: AbortController, // Added controller parameter
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

    try {
      // Use apiClient to prepare the request URL and headers
      const url = `${apiClient.defaults.baseURL}/ai/stream/${agent}`;
      const headers = {
        ...apiClient.defaults.headers.common, // Include common headers from apiClient
        "Content-Type": "application/json"
      };

      // Ensure the Authorization header is explicitly included
      if (!headers["Authorization"]) {
        const token = localStorage.getItem("accessToken");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      // Use fetch for streaming response
      const response = await fetch(url, {
        method: "POST",
        headers: Object.fromEntries(Object.entries(headers).map(([key, value]) => [key, String(value)])),
        body: JSON.stringify(bodyParams),
        signal: controller.signal // Attach signal to fetch request
      });

      if (!response.body) {
        throw new Error("Failed to establish connection for streaming.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      async function* streamProcessor() {
        let buffer = "";

        while (true) {
          try {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const events = buffer.split("\n\n");
            buffer = events.pop() ?? "";

            for (const event of events) {
              if (event.startsWith("data:")) {
                try {
                  const jsonStr = event.replace(/^data:\s*/, "");
                  if (jsonStr === "[DONE]") {
                    reader.cancel();
                    return;
                  }
                  yield JSON.parse(jsonStr);
                } catch (error) {
                  console.log("Failed to parse AI response chunk:", error);
                  console.error("Failed to parse AI response chunk with event:", event);
                }
              }
            }
          } catch (error) {
            console.error("Stream reading aborted or failed:", error);
            return;
          }
        }

        if (buffer.startsWith("data:")) {
          try {
            yield JSON.parse(buffer.replace(/^data:\s*/, ""));
          } catch (error) {
            console.log("Failed to parse final AI response chunk:", error);
            console.error("Failed to parse final AI response chunk at buffer:", buffer);
          }
        }
      }

      return streamProcessor();
    } catch (error) {
      console.log("Failed to establish connection for streaming:", error);
      return;
    }
  },

  // GET PROBLEM CHATBOT HISTORY
  getProblemThreadsHistory: async (userId: string, problemId: string) => {
    const response = await apiClient.get(`/ai/conversation/${userId}/problem/${problemId}/threads`);
    // Remove quotes from chat title
    response.data.data.map((thread: ChatbotHistoryItemType) => {
      thread.title = removeChatTitleQuotes(thread.title);
    });
    return response.data;
  },
  // GET PROBLEM CHATBOT THREAD DETAILS
  getProblemThreadDetails: async (userId: string, problemId: string, threadId: string) => {
    const response = await apiClient.get(`/ai/conversation/${userId}/problem/${problemId}/thread/${threadId}`);
    return response.data;
  },
  // GET PROBLEM CHATBOT MESSAGE COUNT
  getProblemChatbotUsage: async () => {
    const response = await apiClient.get(`/ai/stream/problem_chatbot/usage`);
    return response.data;
  },
  // GET LESSON CHATBOT MESSAGE COUNT
  getLessonChatbotUsage: async () => {
    const response = await apiClient.get(`/ai/stream/lesson_chatbot/usage`);
    return response.data;
  }
};
