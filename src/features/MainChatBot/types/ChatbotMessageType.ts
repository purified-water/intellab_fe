export interface ChatbotMessageResponseType {
  type: string;
  content: string;
  tool_calls: any[];
  tool_call_id: string | null;
  run_id: string;
  metadata: {
    model: string;
    created_at: string;
    done: boolean;
    done_reason: string;
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
    message: {
      role: string;
      content: string;
      images: any | null;
      tool_calls: any | null;
    };
  };
  custom_data: Record<string, any>;
  thread_id: string;
}

export interface ChatbotMessageInputType {
  message: string;
  model: string;
  user_id: string;
  thread_id?: string | null;
}
