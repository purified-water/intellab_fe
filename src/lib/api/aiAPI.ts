import axios from "axios";
import { ChatbotMessageInputType } from "@/features/MainChatBot/types/ChatbotMessageType";
import { AI_AGENT } from "@/constants";
import { ChatbotHistoryItemType, ChatTitleGeneratorPayload } from "@/features/MainChatBot/types";
import { removeChatTitleQuotes } from "@/utils";
const BASE_URL = "http://localhost:8006/ai"; // Wait for AI service to connect with API gateway

export const aiAPI = {
  // *********** //
  // AI SUMMARY  //
  // *********** //
  getCourseSummary: async (courseName: string, courseId: string, regenereate: "true" | "false") => {
    const bodyParams = {
      message: `course name: ${courseName}, id: ${courseId}, regenerate: ${regenereate}`,
      modal: "groq-llama-3.3-70b"
    };
    const response = await axios.post(`${BASE_URL}/invoke/${AI_AGENT.SUMMARIZE_ASSISTANT}`, bodyParams);
    return response.data;
  },

  getCourseSummaryStream: async (
    courseName: string,
    courseId: string,
    userId: string,
    regenerate: "true" | "false"
  ) => {
    const bodyParams = {
      message: `course name: ${courseName}, id: ${courseId}, regenerate: ${regenerate}`,
      user_id: userId,
      model: "groq-llama-3.3-70b"
    };

    try {
      const response = await fetch(`${BASE_URL}/stream/${AI_AGENT.SUMMARIZE_ASSISTANT}`, {
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
    const response = await axios.get(`${BASE_URL}/${AI_AGENT.PDF_SUMMARY}`, {
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
    const response = await axios.post(`${BASE_URL}/invoke/${agent}`, bodyParams);
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

    const response = await axios.post(`${BASE_URL}/invoke/${AI_AGENT.TITLE_GENERATOR}`, bodyParams);
    return response.data;
  },
  getThreadsHistory: async (userId: string) => {
    const response = await axios.get(`${BASE_URL}/conversation/${userId}/threads`);
    // Remove quotes from chat title
    response.data.data.map((thread: ChatbotHistoryItemType) => {
      thread.title = removeChatTitleQuotes(thread.title);
    });
    return response.data;
  },
  getThreadDetails: async (userId: string, threadId: string) => {
    const response = await axios.get(`${BASE_URL}/conversation/${userId}/thread/${threadId}`);
    return response.data;
  },
  // AI MAIN CHATBOT/PROBLEM ASSISTANT STREAMING DATA - SSE
  postChatbotMessageStream: async (
    agent: "global_chatbot" | "problem_chatbot",
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
      const response = await fetch(`${BASE_URL}/stream/${agent}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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
      controller.abort();
      return;
    }
  },

  // GET PROBLEM CHATBOT HISTORY
  getProblemThreadsHistory: async (userId: string, problemId: string) => {
    const response = await axios.get(`${BASE_URL}/conversation/${userId}/problem/${problemId}/threads`);
    // Remove quotes from chat title
    response.data.data.map((thread: ChatbotHistoryItemType) => {
      thread.title = removeChatTitleQuotes(thread.title);
    });
    return response.data;
  },
  // GET PROBLEM CHATBOT THREAD DETAILS
  getProblemThreadDetails: async (userId: string, problemId: string, threadId: string) => {
    const response = await axios.get(`${BASE_URL}/conversation/${userId}/problem/${problemId}/thread/${threadId}`);
    return response.data;
  }
};
