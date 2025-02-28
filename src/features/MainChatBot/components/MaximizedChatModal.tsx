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
  SquareArrowOutUpRight,
  SquarePen,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// const initialChat = [
//   { id: "1", sender: "ai", timestamp: Date.now(), content: "Hello! How can I help you?" },
//   { id: "2", sender: "user", timestamp: Date.now() + 1, content: "What is the meaning of life?" },
//   { id: "3", sender: "ai", timestamp: Date.now() + 2, content: "42. Just kidding! It depends on your perspective." },
// ];

export const ChatbotModal = ({ isOpen, onClose }: ChatbotModalProps) => {
  const [messages, setMessages] = useState([] as any[]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height before resizing
      textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 300)}px`; // Limit max height
    }
  }, [input]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // FIX: Sidebar should stay in place when scrolling chat content
    if (isOpen && !isMinimized) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Enable scrolling when modal is closed
    }

    return () => {
      document.body.style.overflow = ""; // Ensure scrolling is reset when component unmounts
    };
  }, [isOpen, isMinimized]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      timestamp: Date.now(),
      content: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        timestamp: Date.now() + 1,
        content: "That's an interesting question! Let me think..."
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
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
      <div className="flex flex-col flex-grow max-h-full px-2 py-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div
        id="overlay"
        className={`fixed z-50 ${
          isMinimized ? "bottom-4 right-4 max-w-[500px] max-h-[1200px]" : "inset-0 flex items-center justify-center"
        }`}
      >
        <div
          className={`relative flex flex-col bg-white/80 overflow-y-scroll backdrop-blur-lg rounded-lg shadow-appFadedPrimary shadow-xl transition-all duration-300 ease-in-out ${
            isMinimized ? "w-[500px] h-[550px] scale-75" : "w-[90%] h-[90%] scale-100"
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

              <Button variant="ghost" className="flex items-center space-x-2 hover:text-gray1" onClick={onClose}>
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

          {!isMinimized && <ChatSidebar isOpen={isSidebarOpen} />}

          <div
            id="chat-content"
            className={`relative flex flex-col flex-grow px-4 pt-4 pb-6 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}
          >
            {/* Chat Content or Welcome Message */}
            <div className="flex flex-col flex-grow overflow-scroll">
              {messages.length === 0 ? renderWelcomeChat() : renderChat()}
            </div>

            {/* Input Field (Moves to Bottom on User Interaction) */}
            <div className="sticky z-10 flex items-end px-2 mt-4 bottom-6">
              <textarea
                ref={textAreaRef}
                rows={1}
                placeholder="Ask Intellab anything..."
                className={`flex-grow border shadow-sm ${isMinimized ? "max-h-[100px]" : "max-h-[300px]"} px-4 py-2 overflow-y-auto bg-white rounded-lg focus:outline-none leading-relaxed`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <button
                onClick={sendMessage}
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
