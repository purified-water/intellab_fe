import { Button } from "@/components/ui";

import { ChatbotMessageResponseType } from "@/features/MainChatBot/types/ChatbotMessageType";
import { aiAPI } from "@/lib/api";
import {
  addMessage,
  clearChatDetail,
  setChatDetail,
  updateLastMessage,
  updateLastMessageContent,
  updateThreadId
} from "@/redux/mainChatbot/mainChatbotSlice";
import { ChatbotHistoryItemType, ChatbotMessageContentType } from "@/redux/mainChatbot/mainChatbotType";
import { RootState } from "@/redux/rootReducer";
import { getUserIdFromLocalStorage } from "@/utils";
import { isUserInactive, updateLastVisit } from "@/utils/inactivityChecker";
import { Plus, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineSparkles } from "rocketicons/hi2";
import { renderWelcomeChat, ProblemChatInput } from "./index";
import { ChatBubble } from "@/components/ui";
import { ChatHistoryDropDown } from "./ChatHistoryDropDown";
import { AI_AGENT, CHATBOT_MODELS } from "@/constants";
import { ProblemType } from "@/types/ProblemType";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";

interface RenderAIAssistantProps {
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (isAIAssistantOpen: boolean) => void;
  problem: ProblemType | null;
  code: string;
}

export const RenderAIAssistant = ({ isAIAssistantOpen, setIsAIAssistantOpen, problem, code }: RenderAIAssistantProps) => {
  const [input, setInput] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatContentRef = useRef<HTMLDivElement | null>(null);
  const [chatHistoryItems, setChatHistoryItems] = useState<ChatbotHistoryItemType[]>([]);
  const [chatModel, setChatModel] = useState(CHATBOT_MODELS["gemini-2_5-flash"].value);
  const userId = getUserIdFromLocalStorage();
  // Redux state and dispatch
  const dispatch = useDispatch();
  const chatDetail = useSelector((state: RootState) => state.mainChatbot.chatDetail);
  const toast = useToast();
  // Handle data stream signals
  const [isLoadingResponse, setIsLoadingResponse] = useState(false); // When waiting for response
  const [isStreaming, setIsStreaming] = useState(false); // When is receiving data stream
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [remainingMessageCount, setRemainingMessageCount] = useState(0);
  const [isChatbotUnlimited, setIsChatbotUnlimited] = useState(false);

  useEffect(() => {
    fetchChatHistory();
    getChabotUsage();
  }, []);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height before resizing
      textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 300)}px`; // Limit max height
    }
  }, [input]);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [chatDetail?.messages]);

  const renderAIAsisstantTabButton = () => {
    return (
      <div className="flex items-center font-semibold text-appAccent max-w-32">
        <HiOutlineSparkles className="inline-block mr-2 icon-appAccent " />
        AI Assistant
      </div>
    );
  };

  const renderChat = () => {
    return (
      <div
        ref={chatContentRef}
        style={{ scrollBehavior: "smooth" }} // Add this style for smooth scrolling
        className="flex flex-col flex-grow max-h-full px-2 py-12 space-y-4 overflow-y-auto"
      >
        {chatDetail?.messages.map((message, index) => <ChatBubble variant="problemAI" key={index} message={message} />)}
        {isLoadingResponse && <ChatBubble isLoadingResponse={isLoadingResponse} />}
      </div>
    );
  };

  // Fetch chat history on component mount
  const fetchChatHistory = async () => {
    if (!userId) return;

    try {
      if (!problem) return;
      const response = await aiAPI.getProblemThreadsHistory(userId, problem.problemId);

      setChatHistoryItems(response.data);
      // If the user is new, show the welcome message
      if (isUserInactive() || response.data.length === 0) {
        dispatch(clearChatDetail());
        return;
      } else {
        handleGetChatDetail(response.data[response.data.length - 1]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewChat = useCallback(() => {
    dispatch(clearChatDetail());
    setInput("");
  }, [dispatch]);

  const handleStopStreaming = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsStreaming(false);
    }
  };

  const handleSendMessageStream = async () => {
    if (!input.trim()) {
      showToastError({ toast: toast.toast, message: "Please enter a message" });
      return;
    }
    if (!userId) {
      showToastError({ toast: toast.toast, message: "Please login to continue" });
      return;
    }

    const formatAIMessageInputContent = (problemDescription: string, problemId: string, userInput: string, code: string) => {
      return `Problem: ${problemDescription} Problem_id: ${problemId} Code: ${code} Question: ${userInput}`;
    };

    updateLastVisit();

    const trimmedInput = input.trim();
    // Initialize abort controller
    const controller = new AbortController();
    setAbortController(controller);

    let isNewChat: boolean = false;
    if (chatDetail?.thread_id === null) {
      isNewChat = true;
    }

    // Used to set the user message in the chat
    const userMessage: ChatbotMessageContentType = {
      type: "user",
      content: trimmedInput,
      timestamp: new Date().toISOString(),
      metadata: { model: chatModel }
    };

    const aiMessagePlaceholder: ChatbotMessageContentType = {
      type: "ai",
      content: "",
      timestamp: new Date().toISOString(),
      metadata: { model: chatModel }
    };

    dispatch(addMessage(userMessage));
    dispatch(addMessage(aiMessagePlaceholder)); // Add AI placeholder message

    setInput("");
    setIsLoadingResponse(true);

    try {
      if (!problem) return;
      const formattedInput = formatAIMessageInputContent(problem?.description, problem?.problemId, input, code);

      // Has to format input with the following: "Problem: <problem> Question: <question>"
      const responseStream = await aiAPI.postChatbotMessageStream(
        AI_AGENT.PROBLEM_CHATBOT,
        formattedInput,
        chatModel,
        userId,
        controller,
        chatDetail?.thread_id
      );

      updateLastVisit();
      setIsStreaming(true);

      let accumulatedContent = ""; // Store streamed tokens
      let firstChunkReceived = false;

      if (!responseStream) return;

      for await (const chunk of responseStream) {
        if (!firstChunkReceived) {
          firstChunkReceived = true;
          setIsLoadingResponse(false);
        }

        if (chunk.type === "token") {
          accumulatedContent += chunk.content;
          dispatch(updateLastMessageContent(accumulatedContent)); // Update AI message progressively
        } else if (chunk.type === "message") {
          const responseData = chunk.content as ChatbotMessageResponseType;
          const finalMessage = {
            type: responseData.type,
            content: responseData.content,
            timestamp: responseData.metadata.created_at,
            metadata: {
              model: responseData.metadata.model
            }
          } as ChatbotMessageContentType;

          dispatch(updateLastMessage(finalMessage)); // Replace streamed content with final response

          if (chatDetail?.thread_id === null) {
            dispatch(updateThreadId(responseData.thread_id));
          }
          // TO DO: Add new title generation. Its returing error
          if (isNewChat) {
            const inputWithMoreContext = problem.problemName + " " + trimmedInput;
            await aiAPI.postGenerateTitle(
              AI_AGENT.PROBLEM_CHATBOT,
              inputWithMoreContext, // Dont need the problem description
              userId,
              responseData.thread_id,
              problem.problemId
            );
            // Update the new chat history
            fetchChatHistory();
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setIsLoadingResponse(false);
        const errorMsg = error.message || "Failed to process your request. Please try again.";
        dispatch(
          updateLastMessage({
            type: "ai",
            content: errorMsg,
            timestamp: new Date().toISOString(),
            metadata: { model: chatModel }
          })
        );
        console.error("Error in sending message", error);
      }
    } finally {
      setIsLoadingResponse(false);
      setIsStreaming(false);
      getChabotUsage();
    }
  };

  const handleGetChatDetail = async (chatItem: ChatbotHistoryItemType) => {
    if (!chatItem.thread_id || !userId || !problem) return;

    try {
      const response = await aiAPI.getProblemThreadDetails(userId, problem?.problemId, chatItem.thread_id);

      updateLastVisit();
      dispatch(setChatDetail(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const getChabotUsage = async () => {
    try {
      const data = await aiAPI.getProblemChatbotUsage();
      setIsChatbotUnlimited(data.unlimited);
      setRemainingMessageCount(data.remaining_usage);
    } catch (error) {
      console.error("Error fetching chatbot usage:", error);
    }
  };

  if (!isAIAssistantOpen) return null;

  return (
    <div className="flex flex-col h-full">
      <div
        id="tab-buttons"
        className="flex items-center justify-between px-4 py-[6px] overflow-y-hidden border-b h-fit gap-x-4 sm:overflow-x-auto scrollbar-hide shrink-0"
      >
        {renderAIAsisstantTabButton()}
        <div className="flex items-center space-x-1 text-gray3 action-buttons">
          <ChatHistoryDropDown chatHistoryItems={chatHistoryItems} onSelectChat={handleGetChatDetail} />

          <Button type="button" onClick={handleNewChat} variant="ghost" className="px-1 py-0 hover:text-gray1">
            <Plus />
          </Button>
          <Button
            type="button"
            onClick={() => setIsAIAssistantOpen(false)}
            variant="ghost"
            className="px-1 py-0 hover:text-gray1"
          >
            <X />
          </Button>
        </div>
      </div>
      <div id="chat-messages" className="flex flex-col flex-grow max-h-screen overflow-hidden">
        {chatDetail?.messages.length === 0 ? renderWelcomeChat() : renderChat()}
      </div>

      <ProblemChatInput
        input={input}
        setInput={setInput}
        chatModel={chatModel}
        setChatModel={setChatModel}
        handleSendMessage={handleSendMessageStream}
        textAreaRef={textAreaRef}
        isLoading={isLoadingResponse}
        isSubmitting={isStreaming}
        handleCancel={handleStopStreaming}
        isUnlimited={isChatbotUnlimited}
        messageCount={remainingMessageCount}
      />
    </div>
  );
};
