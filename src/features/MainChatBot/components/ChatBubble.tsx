import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/esm/styles/prism";
import clsx from "clsx";
import { ChatbotMessageContentType } from "../types/ChatbotHistoryType";
import { linkMappings } from "../constants/linkMappings";

interface ChatBubbleProps {
  message?: ChatbotMessageContentType;
  isLoadingResponse?: boolean;
  variant?: "mainAI" | "problemAI" | string;
}

const variantClasses: Record<string, string> = {
  mainAI: "text-base",
  problemAI: "text-sm"
};

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

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLoadingResponse, variant = "mainAI" }) => {
  if (isLoadingResponse || message?.content === "") {
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

  // Normalize content to ensure proper markdown rendering
  let normalizedContent = message.content;

  // Trim extra whitespace that might affect markdown rendering
  normalizedContent = normalizedContent.replace(/^\s+/gm, (match) => {
    // Preserve at most 4 spaces at the beginning of each line (for markdown indentation)
    return match.length > 4 ? " ".repeat(4) : match;
  });

  // Format links dynamically
  const formattedContent = formatMessageContent(normalizedContent);

  return (
    <div className={clsx("flex my-2", message.type === "user" ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "px-4 rounded-lg",
          variantClasses[variant] || "text-base", // Default to text-base if variant is unknown
          message.type === "user" ? "bg-appFadedPrimary/50" : `${variant === "problemAI" ? "bg-gray6/50" : "bg-white"}`,
          isLongMessage ? "md:max-w-3xl max-w-md" : "max-w-lg md:max-w-lg"
        )}
      >
        {/* Render AI message as Markdown with formatted links and code highlighting */}
        <ReactMarkdown
          className="prose-sm prose md:prose-base markdown"
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  style={xonokai}
                  PreTag="div"
                  className="my-3 overflow-hidden rounded-md"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={clsx("rounded-md px-1 py-0.5 bg-gray-100", className)} {...props}>
                  {children}
                </code>
              );
            },
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline text-appPrimary hover:text-appPrimary/80"
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
