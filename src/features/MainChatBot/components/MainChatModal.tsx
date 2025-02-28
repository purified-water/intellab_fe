"use strict";
import { useState, useRef, useEffect } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";
import ChatBubble from "./ChatBubble";
import { aiOrbLogo } from "@/assets";
import {
  PanelLeft,
  PanelLeftClose,
  X,
  Minus,
  Maximize2,
  // SquareArrowOutUpRight,
  SquarePen,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  ChatbotHistoryDetailType,
  ChatbotHistoryItemType,
  ChatbotMessageContentType
} from "../types/ChatbotHistoryType";
import { ChatbotMessageResponseType } from "../types/ChatbotMessageType";
import { aiAPI } from "@/lib/api";
import { getUserIdFromLocalStorage } from "@/utils";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { clearChatDetail, setChatDetail, addMessage, updateThreadId } from "@/redux/mainChatbot/mainChatbotSlice";
import { isUserInactive, updateLastVisit } from "@/utils/inactivityChecker";
interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatbotModal = ({ isOpen, onClose }: ChatbotModalProps) => {
  // const [chatDetail, setChatDetail] = useState<ChatbotHistoryDetailType | null>({
  //   thread_id: null,
  //   timestamp: "",
  //   messages: []
  // });
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatContentRef = useRef<HTMLDivElement | null>(null);
  const [chatModel, setChatModel] = useState("groq-llama-3.3-70b");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [chatHistoryItems, setChatHistoryItems] = useState<ChatbotHistoryItemType[]>([]);
  const { toast } = useToast();
  const userId = getUserIdFromLocalStorage();
  // Redux state and dispatch
  const dispatch = useDispatch();
  const chatDetail = useSelector((state: RootState) => state.mainChatbot.chatDetail);

  console.log("Is user inactive?", isUserInactive());
  console.log("Chat detail", chatDetail);

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
    console.log("Userid", userId);
    try {
      const response = await aiAPI.getThreadsHistory(userId);
      // console.log("Chat history fetched", response);
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

  const handleNewChat = () => {
    dispatch(clearChatDetail());
    setInput("");
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !userId) return;

    updateLastVisit();

    const trimmedInput = input.trim();

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

    // dispatch(setChatDetail({
    //   ...chatDetail,
    //   thread_id: chatDetail?.thread_id ?? null,
    //   timestamp: chatDetail?.timestamp ?? "",
    //   messages: [...(chatDetail?.messages || []), userMessage] // Append user message
    // }));

    dispatch(addMessage(userMessage));
    console.log("After sending message:", chatDetail?.messages);

    setInput("");

    try {
      setIsLoadingResponse(true);
      const responseData: ChatbotMessageResponseType = await aiAPI.postMainChatbotMessage(
        trimmedInput,
        chatModel,
        userId,
        chatDetail?.thread_id
      ); //

      if (!responseData) {
        toast({
          title: "Failed to get response",
          description: "An error occurred while fetching the AI's response",
          variant: "destructive"
        });
        return;
      }
      // setChatDetail((prev) => {
      //   if (!prev) return null;
      //   return {
      //     ...prev,
      //     thread_id: responseData.thread_id
      //   };
      // });
      setIsLoadingResponse(false);
      updateLastVisit();

      if (chatDetail?.thread_id === null) {
        dispatch(updateThreadId(responseData.thread_id));
      }

      const aiMessage = {
        type: responseData.type,
        content: responseData.content,
        timestamp: responseData.metadata.created_at,
        metadata: {
          model: responseData.metadata.model
        }
      } as ChatbotMessageContentType;

      // dispatch(setChatDetail({
      //   ...chatDetail,
      //   thread_id: chatDetail?.thread_id ?? null,
      //   timestamp: chatDetail?.timestamp ?? "",
      //   messages: [...(chatDetail?.messages || []), aiMessage] // Append messages safely without overwriting
      // }));
      dispatch(addMessage(aiMessage));
      console.log("After sending message:", chatDetail?.messages);
      // Generate the chat title for chat history
      if (isNewChat) {
        await aiAPI.postGenerateTitle(trimmedInput, userId, responseData.thread_id);
        // Update the new chat history
        fetchChatHistory();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleGetChatDetail = async (chatItem: ChatbotHistoryItemType) => {
    if (!chatItem.thread_id || !userId) return;
    console.log("Getting chat details for thread", chatItem.thread_id);
    try {
      const response = await aiAPI.getThreadDetails(userId, chatItem.thread_id);

      updateLastVisit();
      dispatch(setChatDetail(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  const renderWelcomeChat = () => {
    return (
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <div className="w-24 h-24 mb-4">
          <img src={aiOrbLogo} alt="AI Orb Logo" className="object-cover w-full h-full" />
        </div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-appPrimary to-appAccent">
          Welcome to Intellab AI!
        </h1>
        <p className="mt-2 text-gray-600">Ask me anything about Intellab.</p>
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
        {chatDetail?.messages.map((message, index) => <ChatBubble key={index} message={message} />)}
        {isLoadingResponse && <ChatBubble isLoadingResponse />}
        {/* <div ref={chatEndRef} /> */}
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div
        id="overlay"
        className={`fixed z-50 ${isMinimized
          ? "bottom-4 right-4 max-w-[520px] max-h-[1200px]"
          : "inset-0 flex items-center justify-center bg-gray3/30"
          }`}
      >
        <div
          id="chat-container"
          className={`relative flex flex-col bg-white/80 overflow-y-hidden backdrop-blur-lg rounded-lg shadow-appFadedPrimary shadow-xl transition-all duration-300 ease-in-out ${isMinimized ? "w-[520px] h-[650px] scale-75" : "w-[90%] h-[90%] scale-100"
            }`}
          style={{
            transformOrigin: "bottom right",
            transition: "transform 0.15s ease-in-out, opacity 0.15s ease-in-out"
          }}
        >
          {/* Top Bar */}
          <div
            id="action-buttons"
            className={`sticky p-2 top-0 z-10 flex items-center justify-between bg-white transition-all duration- ${isSidebarOpen ? "ml-64" : "ml-0"}`}
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

          {!isMinimized && (
            <ChatSidebar
              isOpen={isSidebarOpen}
              chatHistoryItems={chatHistoryItems}
              onSelectChat={handleGetChatDetail}
            />
          )}

          <div
            id="chat-content"
            className={`relative flex flex-col flex-grow ${isMinimized ? "px-4 pb-6" : "px-16 pb-12"} pt-2 h-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}
          >
            {/* Chat Content or Welcome Message */}
            <div id="chat-messages" className="flex flex-col flex-grow max-h-screen overflow-scroll">
              {chatDetail?.messages.length === 0 ? renderWelcomeChat() : renderChat()}
            </div>

            {/* Input Field (Moves to Bottom on User Interaction) */}
            <div id="chat-input" className="sticky z-10 flex items-end px-2 mt-4 bottom-8">
              <textarea
                ref={textAreaRef}
                rows={1}
                placeholder="Ask Intellab anything..."
                className={`flex-grow border shadow-sm ${isMinimized ? "max-h-[100px]" : "max-h-[300px]"} min-h-11 px-4 py-2 overflow-y-auto bg-white rounded-lg focus:outline-none leading-relaxed`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />

              <button
                onClick={handleSendMessage}
                className="flex items-center justify-center p-2 ml-2 text-white rounded-lg shadow-sm w-11 h-11 bg-gradient-to-tr from-appPrimary to-appAccent hover:opacity-80"
              >
                <ArrowUp className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
