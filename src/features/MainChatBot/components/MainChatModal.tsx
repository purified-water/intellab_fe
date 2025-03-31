"use strict";
import { useState, useRef, useEffect } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";
import { ChatBubble } from "./ChatBubble";
import { AIBackground, aiOrbLogo } from "@/assets";
import {
  PanelLeft,
  PanelLeftClose,
  X,
  Minus,
  Maximize2,
  // SquareArrowOutUpRight,
  SquarePen,
  ArrowUp,
  ChevronDown,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChatbotHistoryItemType, ChatbotMessageContentType } from "../types/ChatbotHistoryType";
import { ChatbotMessageResponseType } from "../types/ChatbotMessageType";
import { aiAPI } from "@/lib/api";
import { getUserIdFromLocalStorage } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import {
  clearChatDetail,
  setChatDetail,
  addMessage,
  updateThreadId,
  updateLastMessageContent,
  updateLastMessage
} from "@/redux/mainChatbot/mainChatbotSlice";
import { isUserInactive, updateLastVisit } from "@/utils/inactivityChecker";
import { CHATBOT_MODELS } from "@/constants/chatbotModels";
import { AI_AGENT } from "@/constants/enums/aiAgents";
import { FaSpinner, FaSquare } from "rocketicons/fa6";
interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatbotModal = ({ isOpen, onClose }: ChatbotModalProps) => {
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatContentRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [chatHistoryItems, setChatHistoryItems] = useState<ChatbotHistoryItemType[]>([]);
  const userId = getUserIdFromLocalStorage();
  // Redux state and dispatch
  const dispatch = useDispatch();
  const chatDetail = useSelector((state: RootState) => state.mainChatbot.chatDetail);

  const [modelChangeOpen, setModelChangeOpen] = useState(false);
  const [chatModel, setChatModel] = useState(CHATBOT_MODELS[0].value);
  // Handle data stream signals
  const [isLoadingResponse, setIsLoadingResponse] = useState(false); // When waiting for response
  const [isStreaming, setIsStreaming] = useState(false); // When is receiving data stream
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  useEffect(() => {
    fetchChatHistory();
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

  useEffect(() => {
    if (isOpen && !isMinimized) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Enable scrolling when modal is closed
    }

    return () => {
      document.body.style.overflow = ""; // Ensure scrolling is reset when component unmounts
    };
  }, [isOpen, isMinimized]);

  // Fetch chat history on component mount
  const fetchChatHistory = async () => {
    if (!userId) return;
    setIsLoadingHistory(true);

    try {
      const response = await aiAPI.getThreadsHistory(userId);

      setChatHistoryItems(response.data);
      setIsLoadingHistory(false);
      // If the user is new, show the welcome message
      if (isUserInactive() || response.data.length === 0) {
        dispatch(clearChatDetail());
        return;
      } else {
        handleGetChatDetail(response.data[response.data.length - 1]);
      }
    } catch (error) {
      setIsLoadingHistory(false);
      console.error(error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleNewChat = () => {
    dispatch(clearChatDetail());
    setInput("");
  };

  const handleSendMessageStream = async () => {
    if (!input.trim() || !userId) return;

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
      const responseStream = await aiAPI.postChatbotMessageStream(
        AI_AGENT.GLOBAL_CHATBOT,
        trimmedInput,
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

          if (isNewChat) {
            await aiAPI.postGenerateTitle(AI_AGENT.GLOBAL_CHATBOT, trimmedInput, userId, responseData.thread_id);
            // Update the new chat history
            fetchChatHistory();
          }
        }
      }
    } catch (error) {
      setIsLoadingResponse(false);
      console.error(error);
    } finally {
      setIsLoadingResponse(false);
      setIsStreaming(false);
    }
  };

  const handleGetChatDetail = async (chatItem: ChatbotHistoryItemType) => {
    if (!chatItem.thread_id || !userId) return;

    try {
      const response = await aiAPI.getThreadDetails(userId, chatItem.thread_id);

      updateLastVisit();
      dispatch(setChatDetail(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  const handleStopStreaming = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsStreaming(false);
    }
  };

  const renderWelcomeChat = () => {
    return (
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <div className="w-24 h-24 mb-4">
          <img src={aiOrbLogo} alt="AI Orb Logo" className="object-cover w-full h-full" />
        </div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-appAIFrom to-appAITo">
          Welcome to Intellab AI!
        </h1>
        <p className="mt-2 text-gray-600">Ask me anything about Intellab.</p>
      </div>
    );
  };

  const renderChatTopBar = () => {
    return (
      <div
        id="action-buttons"
        className={`sticky p-2 top-0 z-10 flex items-center justify-between bg-white transition-all duration- ${isSidebarOpen ? "sm:ml-64" : "ml-0"}`}
      >
        <div className="flex items-center">
          {!isMinimized && (
            <Button variant="ghost" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className=" hover:text-gray1">
              {isSidebarOpen ? <PanelLeftClose /> : <PanelLeft />}
            </Button>
          )}

          <Button variant="ghost" className="flex items-center space-x-2 hover:text-gray1" onClick={handleNewChat}>
            <SquarePen />
            <span>New chat</span>
          </Button>
        </div>

        <Popover open={modelChangeOpen} onOpenChange={setModelChangeOpen}>
          <PopoverTrigger asChild>
            <div
              role="combobox"
              aria-expanded={modelChangeOpen}
              className="flex items-center px-4 py-[5px] space-x-1 text-sm rounded-lg cursor-pointer hover:bg-accent"
            >
              <span className="font-semibold ">
                {CHATBOT_MODELS.find((modelItem) => modelItem.value === chatModel)?.label}
              </span>
              <ChevronDown className="w-4 opacity-50" />
            </div>
          </PopoverTrigger>

          <PopoverContent className="min-w-fit max-w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No model found.</CommandEmpty>
                <CommandGroup>
                  {CHATBOT_MODELS.map((modelItem) => (
                    <CommandItem
                      key={modelItem.value}
                      value={modelItem.value}
                      onSelect={(currentValue) => {
                        setChatModel(currentValue === chatModel ? "" : currentValue);
                        setModelChangeOpen(false);
                      }}
                    >
                      {modelItem.label}
                      <Check className={chatModel === modelItem.value ? "opacity-100" : "opacity-0"} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="flex items-center">
          {/* <button className="hover:text-gray1" onClick={onClose}>
            <SquareArrowOutUpRight/>
          </button> */}
          <Button
            variant="ghost"
            className="hover:text-gray1"
            onClick={() => {
              setIsMinimized(!isMinimized);
              setIsSidebarOpen(false); // Ensure sidebar is hidden when minimized
            }}
          >
            {isMinimized ? <Maximize2 /> : <Minus />}
          </Button>
          <Button variant="ghost" className="hover:text-gray1" onClick={onClose}>
            <X />
          </Button>
        </div>
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

  const renderSidebar = () => {
    if (!isMinimized) {
      return (
        <>
          {isSidebarOpen && (
            <ChatSidebar
              isOpen={isSidebarOpen}
              isLoading={isLoadingHistory}
              chatHistoryItems={chatHistoryItems}
              onSelectChat={handleGetChatDetail}
            />
          )}
        </>
      );
    }
    return null;
  };

  return (
    <SidebarProvider>
      <div
        id="overlay"
        className={`fixed z-50 ${isMinimized
          ? "bottom-4 right-4 max-w-[520px] max-h-[1200px]"
          : "inset-0 flex items-center justify-center bg-black/50"
          }`}
      >
        <div
          id="chat-container"
          className={`relative flex flex-col border-[0.5px] bg-white/80 overflow-y-hidden backdrop-blur-lg rounded-lg shadow-md shadow-appAITo/30 transition-all duration-300 ease-in-out ${isMinimized ? "w-[520px] h-[650px] scale-75" : "w-[90%] h-[90%] scale-100"
            }`}
          style={{
            transformOrigin: "bottom right",
            transition: "transform 0.15s ease-in-out, opacity 0.15s ease-in-out"
          }}
        >
          {/* Background Layer - Moved to the top level container */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat opacity-70 bg-fit"
            style={{ backgroundImage: `url(${AIBackground})` }}
          />

          {/* Glassmorphism Overlay - Also moved to top level */}
          <div className="absolute inset-0 bg-white/65 backdrop-blur-2xl"></div>

          {/* Top Bar */}
          {renderChatTopBar()}

          {/* Sidebar */}
          {renderSidebar()}

          <div
            id="chat-content"
            className={`relative flex flex-col flex-grow ${isMinimized ? "px-2 pb-6 sm:px-4 sm:pb-8" : "px-2 pb-6 sm:px-16 sm:pb-12"} pt-2 h-full transition-all duration-300 ${isSidebarOpen ? "sm:ml-64" : "ml-0"}`}
          >
            {/* Chat Messages (Ensure content stays above the background) */}
            <div className="relative z-10 flex flex-col flex-grow max-h-screen overflow-scroll">
              {chatDetail?.messages.length === 0 ? renderWelcomeChat() : renderChat()}
            </div>

            {/* Input Field */}
            <div id="chat-input" className="sticky z-10 flex items-end px-2 mt-4 bottom-8">
              <textarea
                ref={textAreaRef}
                rows={1}
                placeholder="Don't know where to start? Ask me anything!"
                className={`flex-grow border shadow-sm ${isMinimized ? "max-h-[100px]" : "max-h-[300px]"} min-h-11 px-4 py-2 overflow-y-auto bg-white rounded-lg focus:outline-none leading-relaxed`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.ctrlKey) {
                    e.preventDefault();
                    handleSendMessageStream();
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
                >
                  <ArrowUp className="w-11 h-11" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
