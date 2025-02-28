export interface ChatbotHistoryItemType {
  thread_id: string;
  title: string;
  timestamp: string;
}
// Use for rendering message content in a thread
export interface ChatbotMessageContentType {
  type: "user" | "ai";
  content: string;
  timestamp: string;
  metadata?: {
    model: string;
  };
}

export interface ChatbotHistoryDetailType {
  thread_id: string | null;
  timestamp: string;
  messages: ChatbotMessageContentType[];
}
