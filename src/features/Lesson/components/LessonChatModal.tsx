import { useState, useRef, useEffect } from "react";
import { ChatBubble } from "@/components/ui";
import { aiOrbLogo } from "@/assets";
import { Minus, SquarePen, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RootState } from "@/redux/rootReducer";
import { CHATBOT_MODELS } from "@/constants/chatbotModels";
import { FaSpinner, FaSquare } from "rocketicons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { TooltipContent, Tooltip, TooltipTrigger } from "@/components/ui/shadcn/tooltip";
import { useToast } from "@/hooks";
import { getUserIdFromLocalStorage, showToastError } from "@/utils";
import { ChatbotMessageContentType, ChatbotMessageResponseType } from "@/features/MainChatBot/types";
import {
  addMessage,
  updateLastMessage,
  updateLastMessageContent,
  updateThreadId
} from "@/redux/lessonChatbot/lessonChatbotSlice";
import { ILesson } from "@/types";
import { AI_AGENT } from "@/constants";
import { aiAPI } from "@/lib/api";

interface LessonChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: ILesson | null;
}

export const LessonChatbotModal = ({ isOpen, onClose, lesson }: LessonChatbotModalProps) => {
  const [input, setInput] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatContentRef = useRef<HTMLDivElement | null>(null);
  // Redux state and dispatch
  const chatDetail = useSelector((state: RootState) => state.lessonChatbot.chatDetail);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  // const [modelChangeOpen, setModelChangeOpen] = useState(false);
  const [chatModel] = useState(CHATBOT_MODELS["qwen3-14b"].value);
  // Handle data stream signals
  const [isStreaming, setIsStreaming] = useState(false); // When is receiving data stream
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const toast = useToast();
  const dispatch = useDispatch();
  const userId = getUserIdFromLocalStorage();
  const [remainingMessageCount, setRemainingMessageCount] = useState(0);

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

  useEffect(() => {
    if (isOpen) {
      getChabotUsage();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStopStreaming = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsStreaming(false);
    }
  };

  const getChabotUsage = async () => {
    try {
      const data = await aiAPI.getLessonChatbotUsage();

      setRemainingMessageCount(data.remaining_usage);
    } catch (error) {
      console.error("Error fetching chatbot usage:", error);
    }
  };

  const formatAIMessageInputContent = (lessonDescription: string, lessonId: string, userInput: string) => {
    return `Lesson: ${lessonDescription} Lesson_id: ${lessonId} Question: ${userInput}`;
  };

  const handleSendMessageStream = async () => {
    if (!input || !input.trim()) {
      showToastError({ toast: toast.toast, message: "Please enter a message" });
      return;
    }
    if (!userId) {
      showToastError({ toast: toast.toast, message: "Please login to continue" });
      return;
    }

    const trimmedInput = input.trim();
    // Initialize abort controller
    const controller = new AbortController();
    setAbortController(controller);

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
      if (!lesson) return;
      const formattedInput = formatAIMessageInputContent(lesson?.content, lesson?.lessonId, input);

      // Has to format input with the following: "Problem: <problem> Question: <question>"
      const responseStream = await aiAPI.postChatbotMessageStream(
        AI_AGENT.LESSON_CHATBOT,
        formattedInput,
        chatModel,
        userId,
        controller,
        chatDetail?.thread_id
      );

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
        }
      }
    } catch (error) {
      setIsLoadingResponse(false);
      console.error("Error in sending message", error);
    } finally {
      setIsLoadingResponse(false);
      setIsStreaming(false);
      getChabotUsage();
    }
  };

  const renderWelcomeChat = () => {
    return (
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <div className="w-12 h-12 mb-4">
          <img src={aiOrbLogo} alt="AI Orb Logo" className="object-cover w-full h-full" />
        </div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-appAIFrom to-appAITo">
          Welcome to Intellab AI!
        </h1>
        <p className="mt-2 text-gray-600">Ask me anything about the lesson</p>
      </div>
    );
  };

  const renderChatTopBar = () => {
    return (
      <div
        id="action-buttons"
        className={`sticky px-2 py-2 top-0 z-20 flex items-center border-b border-appAIFrom justify-between bg-white transition-all [&_svg]:size-4`}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="ghost" className="flex items-center space-x-2 hover:text-gray1">
              <SquarePen />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>New chat</p>
          </TooltipContent>
        </Tooltip>

        <span className="text-base font-semibold">Intellab AI</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="ghost" className="hover:text-gray1" onClick={onClose}>
              <Minus />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Close chat</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  };

  const renderChat = () => {
    return (
      <div
        ref={chatContentRef}
        style={{ scrollBehavior: "smooth" }} // Add this style for smooth scrolling
        className="flex flex-col flex-grow max-h-full px-2 py-12 space-y-4 overflow-y-auto scrollbar-hide"
      >
        {chatDetail?.messages.map((message, index) => <ChatBubble key={index} message={message} />)}
        {isLoadingResponse && <ChatBubble isLoadingResponse />}
        {/* <div ref={chatEndRef} /> */}
      </div>
    );
  };

  return (
    <div
      id="overlay"
      className={`fixed z-50 bottom-28 right-8 max-w-[520px] max-h-[1200px] lg:w-[380px] xl:w-[450px] h-[80vh]`}
    >
      <div
        id="chat-container"
        className="relative bg-white flex flex-col border-[1px] rounded-lg shadow-md transition-all duration-300 ease-in-out w-full h-full overflow-hidden"
      >
        {/* Top Bar */}
        {renderChatTopBar()}

        <div
          id="chat-content"
          className={`relative flex flex-col flex-grow px-2 pb-4 sm:px-4 sm:pb-2 pt-2 h-full transition-all duration-300 ml-0`}
        >
          {/* Chat Messages (Ensure content stays above the background) */}
          <div className="relative z-10 flex flex-col max-h-[80%] overflow-y-scroll scrollbar-hide">
            {chatDetail?.messages.length === 0 ? renderWelcomeChat() : renderChat()}
          </div>

          {/* Input Field */}
          <div className="sticky z-10 flex flex-col px-2 gap-y-1 bottom-8">
            <div id="chat-input" className="flex items-end mt-6 ">
              <textarea
                ref={textAreaRef}
                rows={1}
                placeholder="How can I help you?"
                className={`flex-grow border shadow-sm max-h-[100px] min-h-11 px-4 py-2 overflow-y-auto bg-white rounded-lg focus:outline-none leading-relaxed`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                  }
                }}
                disabled={isLoadingResponse || isStreaming}
              />

              {/* Button logic remains the same */}
              {isLoadingResponse ? (
                <div className="flex items-center justify-center p-3 ml-2 text-white rounded-lg shadow-sm cursor-not-allowed h-11 w-11 bg-gradient-to-tr from-appAIFrom/80 to-appAITo/80">
                  <FaSpinner className="inline-block cursor-not-allowed icon-sm animate-spin icon-white" />
                </div>
              ) : isStreaming ? (
                <button
                  onClick={handleStopStreaming}
                  className="flex items-center justify-center p-3 ml-2 text-white rounded-lg shadow-sm h-11 w-11 bg-gradient-to-tr from-appAIFrom to-appAITo hover:opacity-80"
                >
                  <FaSquare className="w-4 h-4 icon-white" />
                </button>
              ) : (
                <button
                  className="flex items-center justify-center p-3 ml-2 text-white rounded-lg shadow-sm h-11 w-11 bg-gradient-to-tr from-appAIFrom to-appAITo hover:opacity-80"
                  onClick={handleSendMessageStream}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessageStream();
                    }
                  }}
                >
                  <ArrowUp className="w-11 h-11" />
                </button>
              )}
            </div>
            <div className="flex items-center text-xs text-gray3">
              {remainingMessageCount > 1000 ? (
                <span className="">&infin; messages</span>
              ) : (
                <span>{remainingMessageCount} messages left</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
