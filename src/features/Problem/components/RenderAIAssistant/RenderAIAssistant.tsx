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
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineSparkles } from "rocketicons/hi2";
import { renderWelcomeChat, ProblemChatInput } from "./index";
import ChatBubble from "@/features/MainChatBot/components/ChatBubble";
import { ChatHistoryDropDown } from "./ChatHistoryDropDown";

interface RenderAIAssistantProps {
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (isAIAssistantOpen: boolean) => void;
}

export const RenderAIAssistant = ({ isAIAssistantOpen, setIsAIAssistantOpen }: RenderAIAssistantProps) => {
  const [input, setInput] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatContentRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [chatHistoryItems, setChatHistoryItems] = useState<ChatbotHistoryItemType[]>([]);
  const [chatModel, setChatModel] = useState("llama3.2");
  const userId = getUserIdFromLocalStorage();
  // Redux state and dispatch
  const dispatch = useDispatch();
  const chatDetail = useSelector((state: RootState) => state.mainChatbot.chatDetail);

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
        {isLoadingResponse && <ChatBubble isLoadingResponse />}
        {/* <div ref={chatEndRef} /> */}
      </div>
    );
  };

  // Fetch chat history on component mount
  const fetchChatHistory = async () => {
    if (!userId) return;

    try {
      const response = await aiAPI.getThreadsHistory(userId);

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

  const handleSendMessageStream = async () => {
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
      const responseStream = await aiAPI.postMainChatbotMessageStream(
        trimmedInput,
        chatModel,
        userId,
        chatDetail?.thread_id
      );

      setIsLoadingResponse(false);
      updateLastVisit();

      let accumulatedContent = ""; // Store streamed tokens
      for await (const chunk of responseStream) {
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
            await aiAPI.postGenerateTitle(trimmedInput, userId, responseData.thread_id);
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
    }
  };

  const handleSendMessageStatic = async () => {
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
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate AI response wait time

      const staticResponse = `
Hello, here is some **code**
\`\`\`python
def hello_world():
  print("Hello, World!")
\`\`\`
HIHIHI
[Click here to view the problem](http://localhost:3000/problems/123)
More code
\`\`\`python
def hello_world():
  print("Hello, World!")
\`\`\`
\`\`\`java
public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}
\`\`\`

- Here is a list item
- Another list item
- Yet another list item

      `;
      const finalMessage: ChatbotMessageContentType = {
        type: "ai",
        content: staticResponse,
        timestamp: new Date().toISOString(),
        metadata: { model: chatModel }
      };

      dispatch(updateLastMessage(finalMessage)); // Replace placeholder with static response

      if (chatDetail?.thread_id === null) {
        dispatch(updateThreadId("static-thread-id"));
      }

      if (isNewChat) {
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

    try {
      const response = await aiAPI.getThreadDetails(userId, chatItem.thread_id);

      updateLastVisit();
      dispatch(setChatDetail(response.data));
    } catch (error) {
      console.error(error);
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

          <Button onClick={handleNewChat} variant="ghost" className="px-1 py-0 hover:text-gray1">
            <Plus />
          </Button>
          <Button onClick={() => setIsAIAssistantOpen(false)} variant="ghost" className="px-1 py-0 hover:text-gray1">
            <X />
          </Button>
        </div>
      </div>
      <div id="chat-messages" className="flex flex-col flex-grow max-h-screen overflow-scroll">
        {chatDetail?.messages.length === 0 ? renderWelcomeChat() : renderChat()}
      </div>

      <ProblemChatInput
        input={input}
        setInput={setInput}
        chatModel={chatModel}
        setChatModel={setChatModel}
        handleSendMessage={handleSendMessageStatic}
        textAreaRef={textAreaRef}
      />
    </div>
  );
};
