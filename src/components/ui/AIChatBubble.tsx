import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/esm/styles/prism";
import clsx from "clsx";
import { ChatbotMessageContentType } from "../../features/MainChatBot/types/ChatbotHistoryType";

interface ChatBubbleProps {
  message?: ChatbotMessageContentType;
  isLoadingResponse?: boolean;
  variant?: "mainAI" | "problemAI" | string;
}

const variantClasses: Record<string, string> = {
  mainAI: "text-base",
  problemAI: "text-sm"
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLoadingResponse, variant = "mainAI" }) => {
  if (!message) return null;

  if (isLoadingResponse || message?.content === "") {
    return (
      <div className="flex justify-start my-2">
        <div className="max-w-xs px-4 py-3 text-base bg-white rounded-xl md:max-w-md">
          <div className="flex items-center space-x-1">
            <span className="w-[5px] h-[5px] bg-black rounded-full animate-bounce"></span>
            <span className="w-[5px] h-[5px] delay-100 bg-black rounded-full animate-bounce"></span>
            <span className="w-[5px] h-[5px] delay-200 bg-black rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  const formattedContent = message.content;

  return (
    <div className={clsx("flex", message.type === "user" ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "px-4 py-2 rounded-xl border-[0.5px] border-gray7/40",
          variantClasses[variant] || "text-base",
          message.type === "user" ? "bg-appAIUserChat" : `${variant === "problemAI" ? "bg-gray6/50" : "bg-white"}`,
          variant === "mainAI" ? "max-w-lg md:max-w-3xl" : " max-w-[100%]"
        )}
      >
        {message.type === "user" ? (
          <p className="">{message.content}</p>
        ) : (
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
                    className="overflow-hidden rounded-md "
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
        )}
      </div>
    </div>
  );
};
