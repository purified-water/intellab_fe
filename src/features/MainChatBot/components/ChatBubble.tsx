import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";
import { ChatbotMessageContentType } from "../types/ChatbotHistoryType";
import { linkMappings } from "../constants/linkMappings";

interface ChatBubbleProps {
  message?: ChatbotMessageContentType;
  isLoadingResponse?: boolean;
}

// Function to replace raw URLs with readable links
const formatMessageContent = (content: string) => {
  return content.replace(/(http?:\/\/localhost:3000\/(course|problems)\/[a-zA-Z0-9-]+)/g, (url) => {
    for (const [pattern, label] of Object.entries(linkMappings)) {
      if (url.includes(pattern)) {
        return `[${label}](<${url}>)`;
      }
    }
    return url; // Default to returning the original link if no match is found
  });
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLoadingResponse }) => {
  if (isLoadingResponse) {
    return (
      <div className="flex justify-start my-2">
        <div className="max-w-xs px-4 py-3 text-base bg-white rounded-lg md:max-w-md">
          <div className="flex items-center space-x-1">
            <span className="w-[5px] h-[5px] bg-black rounded-full animate-bounce"></span>
            <span className="w-[5px] h-[5px] delay-100 bg-black rounded-full animate-bounce"></span>
            <span className="w-[5px] h-[5px] delay-200 bg-black rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  if (!message) return null;

  const wordCount = message.content.split(/\s+/).length;
  const isLongMessage = wordCount > 200;
  const formattedContent = formatMessageContent(message.content); // Format links dynamically

  return (
    <div className={clsx("flex my-2", message.type === "user" ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "px-4 py-3 rounded-lg text-base",
          message.type === "user" ? "bg-appFadedPrimary/50" : "bg-white",
          isLongMessage ? "md:max-w-3xl max-w-md" : "max-w-lg md:max-w-lg"
        )}
      >
        {/* Render AI message as Markdown with formatted links */}
        <ReactMarkdown
          className="prose-sm prose md:prose-base"
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                {children}
              </a>
            )
          }}
        >
          {formattedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatBubble;
