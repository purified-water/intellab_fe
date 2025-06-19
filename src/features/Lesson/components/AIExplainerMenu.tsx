import { Button, Spinner } from "@/components/ui";
import { AI_AGENT, CHATBOT_MODELS } from "@/constants";
import { ChatbotMessageContentType, ChatbotMessageResponseType } from "@/features/MainChatBot/types";
import { useToast } from "@/hooks";
import { aiAPI } from "@/lib/api";
import {
  addMessage,
  updateLastMessage,
  updateLastMessageContent,
  updateThreadId
} from "@/redux/lessonChatbot/lessonChatbotSlice";
import { RootState } from "@/redux/rootReducer";
import { ILesson } from "@/types";
import { getUserIdFromLocalStorage, showToastError } from "@/utils";
import { updateLastVisit } from "@/utils/inactivityChecker";
import { MessageSquare, X } from "lucide-react";
import { forwardRef, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import React, { memo } from "react";

interface AIExplainerMenuProps {
  ref: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  input: string | null;
  setInput: (value: string) => void;
  lesson: ILesson | null;
  setOpenChatbox: (value: boolean) => void;
  resetExplainer?: () => void; // Optional function to reset explainer state
}

export const AIExplainerMenu = memo(
  forwardRef<HTMLDivElement, AIExplainerMenuProps>(
    ({ isOpen, setIsOpen, input, setInput, lesson, setOpenChatbox, resetExplainer }, ref) => {
      const [isLoadingResponse, setIsLoadingResponse] = useState(false);
      const [explainerResponse, setExplainerResponse] = useState("");
      const [errorMessage, setErrorMessage] = useState<string | null>(null);
      const userId = getUserIdFromLocalStorage();
      const toast = useToast();
      const dispatch = useDispatch();

      // Track the streaming operation state
      const abortControllerRef = useRef<AbortController | null>(null);
      const isProcessingRef = useRef<boolean>(false);

      // For streaming response
      const [chatModel] = useState(CHATBOT_MODELS[3].value);
      const chatDetail = useSelector((state: RootState) => state.lessonChatbot.chatDetail);

      // Handle component unmount and abort any in-progress requests
      useEffect(() => {
        return () => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
          }
        };
      }, []);

      // Safe close handler that resets all states and cleans up resources
      const handleClose = () => {
        // Abort any in-progress requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }

        // Clear selection
        window.getSelection()?.removeAllRanges();

        // Reset internal state
        isProcessingRef.current = false;
        setErrorMessage(null);
        setInput("");

        // Close the menu
        setIsOpen(false);
        setExplainerResponse("");

        // Call the external reset function if provided
        if (resetExplainer) {
          resetExplainer();
        }
      };

      // Handle clicks outside the menu
      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (
            ref &&
            (ref as React.RefObject<HTMLDivElement>).current &&
            !(ref as React.RefObject<HTMLDivElement>).current!.contains(event.target as Node)
          ) {
            handleClose();
          }
        };

        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, [isOpen, ref]);

      // Process input when menu opens
      useEffect(() => {
        const timeout = setTimeout(() => {
          if (input && isOpen && !isProcessingRef.current) {
            isProcessingRef.current = true;
            handleSendMessageStream("explain");
          }
        }, 100); // slight delay to prevent premature aborts

        return () => clearTimeout(timeout);
      }, [input, isOpen]);

      if (!isOpen) return null;

      const formatAIMessageInputContent = (
        lessonDescription: string,
        lessonId: string,
        userInput: string,
        inputType: string = "explain"
      ) => {
        const prompt =
          inputType === "simplify"
            ? `Explain this text in simple terms that a beginner would understand: "${userInput}"`
            : `Explain this text concisely: "${userInput}"`;

        return `Lesson: ${lessonDescription} Lesson_id: ${lessonId} Question: ${prompt}`;
      };

      const handleSendMessageStream = async (inputType: string = "explain") => {
        // Ensure we have text to process
        if (!input || !input.trim()) {
          setErrorMessage("No text selected to explain");
          isProcessingRef.current = false;
          return;
        }

        // Verify user is logged in
        if (!userId) {
          showToastError({ toast: toast.toast, message: "Please login to continue" });
          handleClose();
          return;
        }

        // Reset any previous error
        setErrorMessage(null);

        // Update last activity timestamp
        updateLastVisit();

        // Create message content
        const trimmedInput = input.trim();
        const messagePrefix = inputType === "simplify" ? "Simply explain the text: " : "Explain the text: ";
        const userMessage: ChatbotMessageContentType = {
          type: "user",
          content: messagePrefix + trimmedInput,
          timestamp: new Date().toISOString(),
          metadata: { model: chatModel }
        };

        const aiMessagePlaceholder: ChatbotMessageContentType = {
          type: "ai",
          content: "",
          timestamp: new Date().toISOString(),
          metadata: { model: chatModel }
        };

        // Update redux state
        dispatch(addMessage(userMessage));
        dispatch(addMessage(aiMessagePlaceholder));

        // Set loading state
        setIsLoadingResponse(true);

        // Create new abort controller for this request
        const controller = new AbortController();
        abortControllerRef.current?.abort(); // cancel any ongoing
        abortControllerRef.current = controller;

        try {
          if (!lesson) {
            throw new Error("Lesson data is missing");
          }

          const formattedInput = formatAIMessageInputContent(
            lesson?.content,
            lesson?.lessonId,
            trimmedInput,
            inputType
          );

          // Request stream from API
          const responseStream = await aiAPI.postChatbotMessageStream(
            AI_AGENT.LESSON_CHATBOT,
            formattedInput,
            chatModel,
            userId,
            controller,
            chatDetail?.thread_id
          );

          // Update last activity timestamp
          updateLastVisit();

          if (!responseStream) {
            throw new Error("Failed to get response stream");
          }

          let accumulatedContent = "";
          let firstChunkReceived = false;

          // Process the stream
          for await (const chunk of responseStream) {
            // Mark as no longer loading once first chunk is received
            if (!firstChunkReceived) {
              firstChunkReceived = true;
              setIsLoadingResponse(false);
            }

            if (chunk.type === "token") {
              accumulatedContent += chunk.content;
              dispatch(updateLastMessageContent(accumulatedContent));
              setExplainerResponse(accumulatedContent);
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

              dispatch(updateLastMessage(finalMessage));
              setExplainerResponse(responseData.content);

              if (chatDetail?.thread_id === null) {
                dispatch(updateThreadId(responseData.thread_id));
              }
            }
          }
          isProcessingRef.current = false;
        } catch (error) {
          // Only show error if not aborted
          if (error instanceof Error && error.name !== "AbortError") {
            setIsLoadingResponse(false);
            const errorMsg = "Failed to process your request. Please try again.";
            setErrorMessage(errorMsg);
            setExplainerResponse(errorMsg);
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
          // Reset processing flag regardless of outcome
          isProcessingRef.current = false;
        }
      };

      return (
        <>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ zIndex: 20 }}
            className="rounded-xl border-[0.5px] z-20 border-appAIFrom bg-white mt-1 shadow-lg max-h-[320px] w-[400px] max-w-[400px] text-black overflow-hidden"
          >
            <div className={`${isLoadingResponse ? "p-3" : "p-5 pb-0"}`}>
              <Button
                onClick={handleClose}
                className="float-right [&_svg]:size-4 px-1 -mt-3 -mr-1 hover:bg-transparent hover:text-gray2/80"
                variant="ghost"
              >
                <X />
              </Button>

              <div className="relative mr-5">
                <div
                  className={`pr-1 overflow-y-auto transition-all duration-300 ${isLoadingResponse ? "h-8" : "h-[180px]"}`}
                >
                  {isLoadingResponse ? (
                    <div className="flex items-center h-full space-x-2">
                      <Spinner loading={isLoadingResponse} className="text-black size-5" />
                      <span className="text-sm text-gray-600">Explaining...</span>
                    </div>
                  ) : errorMessage ? (
                    <div className="text-red-500">{errorMessage}</div>
                  ) : (
                    <Markdown className="prose">{explainerResponse || "Select text to explain"}</Markdown>
                  )}
                </div>

                {/* Scrim gradients */}
                <div className="absolute top-0 left-0 right-0 h-3 pointer-events-none bg-gradient-to-b from-white/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-3 pointer-events-none bg-gradient-to-t from-white/70 to-transparent" />
              </div>
            </div>

            {!isLoadingResponse && (
              <div className="flex flex-col px-4 py-3 space-y-2 text-sm">
                <p className="text-gray3">Explained with Intellab AI</p>
                <div className="flex justify-between w-full rounded-b-xl bg-white/90">
                  <Button
                    onClick={() => {
                      // Only process if not already processing
                      if (!isProcessingRef.current) {
                        isProcessingRef.current = true;
                        handleSendMessageStream("simplify");
                      }
                    }}
                    className="mr-2 rounded-full cursor-pointer hover:bg-appAccent/80 bg-appAccent w-fit"
                    disabled={isLoadingResponse && isProcessingRef.current}
                  >
                    <span>Simplify</span>
                  </Button>

                  <Button
                    className="cursor-pointer w-fit hover:bg-transparent text-gray2 hover:text-gray2/80"
                    variant="ghost"
                    disabled={isLoadingResponse && isProcessingRef.current}
                    onClick={() => {
                      handleClose();
                      setOpenChatbox(true);
                    }}
                  >
                    <MessageSquare className="mr-1" />
                    <span>Ask a follow-up</span>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      );
    }
  )
);

AIExplainerMenu.displayName = "AIExplainerMenu";
