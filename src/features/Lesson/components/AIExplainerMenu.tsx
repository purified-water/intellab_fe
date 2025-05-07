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

interface AIExplainerMenuProps {
  ref: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  input: string | null;
  setInput: (value: string) => void;
  lesson: ILesson | null;
  setOpenChatbox: (value: boolean) => void;
}
// Use forwardRef to expose the ref to the parent component, deprecated in React 19 but still used in React 18
export const AIExplainerMenu = forwardRef<HTMLDivElement, AIExplainerMenuProps>(
  ({ isOpen, setIsOpen, input, setInput, lesson, setOpenChatbox }, ref) => {
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [explainerResponse, setExplainerResponse] = useState("");
    const userId = getUserIdFromLocalStorage();
    const toast = useToast();
    const dispatch = useDispatch();

    // Track the previous input to prevent duplicate processing
    const prevInputRef = useRef<string | null>(null);
    const isProcessingRef = useRef<boolean>(false);

    // For streaming response
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [chatModel] = useState(CHATBOT_MODELS[0].value);
    const chatDetail = useSelector((state: RootState) => state.lessonChatbot.chatDetail);

    const handleClose = () => {
      if (abortController) {
        abortController.abort();
        setAbortController(null);
      }
      window.getSelection()?.removeAllRanges();
      isProcessingRef.current = false;
      setIsOpen(false);
      setExplainerResponse("");
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          ref &&
          (ref as React.RefObject<HTMLDivElement>).current &&
          !(ref as React.RefObject<HTMLDivElement>).current!.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, ref]);

    // Modified useEffect to prevent duplicate processing
    useEffect(() => {
      // Only process if we have input, it's not already being processed, and it's different from previous input
      if (!input || isProcessingRef.current === true || input === prevInputRef.current) return;
      // Set processing flag and store current input
      isProcessingRef.current = true;
      prevInputRef.current = input;

      // Process the input
      handleSendMessageStream();
    }, [input, isOpen]);

    // Clear previous input when menu closes
    useEffect(() => {
      if (!isOpen) {
        prevInputRef.current = null;
      }
    }, [isOpen]);

    if (!isOpen) return null;

    const formatAIMessageInputContent = (
      lessonDescription: string,
      lessonId: string,
      userInput: string,
      inputType: string = "explain"
    ) => {
      if (inputType === "simplify") {
        return `Lesson: ${lessonDescription} Lesson_id: ${lessonId} Question: Explain the text in simple terms: "${userInput}"`;
      }
      return `Lesson: ${lessonDescription} Lesson_id: ${lessonId} Question: Explain the text concisely: "${userInput}"`;
    };

    const handleSendMessageStream = async (inputType: string = "explain") => {
      if (!input || !input.trim()) {
        showToastError({ toast: toast.toast, message: "Please enter a message" });
        return;
      }
      if (!userId) {
        showToastError({ toast: toast.toast, message: "Please login to continue" });
        return;
      }

      updateLastVisit();

      const trimmedInput = "Explain the text: " + input.trim();
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

      // Don't clear input here - setInput("");
      setIsLoadingResponse(true);

      try {
        if (!lesson) return;
        const formattedInput = formatAIMessageInputContent(lesson?.content, lesson?.lessonId, input, inputType);

        // Has to format input with the following: "Problem: <problem> Question: <question>"
        const responseStream = await aiAPI.postChatbotMessageStream(
          AI_AGENT.LESSON_CHATBOT,
          formattedInput,
          chatModel,
          userId,
          controller,
          chatDetail?.thread_id
        );

        updateLastVisit();

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

            dispatch(updateLastMessage(finalMessage)); // Replace streamed content with final response
            setExplainerResponse(responseData.content);

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
        // After processing is complete, we should clear the input
        // This ensures the next selection will be treated as new
        setInput("");
        isProcessingRef.current = false;
      }
    };

    return (
      <>
        {/* Explainer Menu */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ zIndex: 20 }}
          className="rounded-xl border-[0.5px] z-20 border-appAIFrom bg-white mt-1 shadow-lg max-h-[320px] w-[400px] max-w-[400px] text-black overflow-hidden" // Important
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
              {/* Scrollable content */}
              <div
                className={`pr-1 overflow-y-auto transition-all duration-300 ${isLoadingResponse ? "h-8" : "h-[180px]"}`}
              >
                {isLoadingResponse ? (
                  <div className="flex items-center h-full space-x-2">
                    <Spinner loading={isLoadingResponse} className="text-black size-5" />
                    <span className="text-sm text-gray-600">Explaining...</span>
                  </div>
                ) : (
                  <Markdown className="prose">{explainerResponse || "No response yet."}</Markdown>
                )}
              </div>

              {/* Scrim gradients (outside scrollable div) */}
              <div className="absolute top-0 left-0 right-0 h-3 pointer-events-none bg-gradient-to-b from-white/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-3 pointer-events-none bg-gradient-to-t from-white/70 to-transparent" />
            </div>
          </div>

          {!isLoadingResponse && (
            <div className="flex flex-col px-4 py-3 space-y-2 text-sm">
              <p className=" text-gray3">Explained with Intellab AI</p>
              <div className="flex justify-between w-full rounded-b-xl bg-white/90">
                <Button
                  onClick={() => handleSendMessageStream("simplify")}
                  className="mr-2 rounded-full cursor-pointer hover:bg-appAccent/80 bg-appAccent w-fit"
                  disabled={isLoadingResponse || isProcessingRef.current}
                >
                  <span>Simplify</span>
                </Button>

                <Button
                  className="cursor-pointer w-fit hover:bg-transparent text-gray2 hover:text-gray2/80"
                  variant="ghost"
                  disabled={isLoadingResponse || isProcessingRef.current}
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
);

AIExplainerMenu.displayName = "AIExplainerMenu";
