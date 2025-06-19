import React, { useEffect, useState } from "react";
import { MessageSquare, TextCursorInput } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/shadcn/tooltip";
import { LessonChatbotModal } from "./LessonChatModal";
import { ILesson } from "@/types";

interface LessonAiOrbProps {
  isExplainerEnabled: boolean;
  setIsExplainerToggled: (value: boolean) => void;
  lesson: ILesson | null;
  askFollowUp?: boolean | undefined;
}

export const LessonAiOrb = React.memo(
  ({ isExplainerEnabled, setIsExplainerToggled, lesson, askFollowUp }: LessonAiOrbProps) => {
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
      if (askFollowUp) setChatOpen(true);
    }, [askFollowUp]);

    return (
      <>
        <div className="fixed z-10 flex overflow-hidden rounded-lg shadow-lg border-[1px] bg-white bottom-10 right-8 w-fit">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setIsExplainerToggled(!isExplainerEnabled);
                  window.getSelection()?.removeAllRanges();
                }}
                className="px-3 py-2 bg-white w-[92px]"
              >
                <div
                  className={cn(
                    "flex items-center rounded-lg p-[2px] hover:bg-opacity-80",
                    isExplainerEnabled ? "bg-gradient-to-tr from-appAIFrom to-appAITo text-white" : "bg-gray4"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-md bg-white transition-transform duration-300 ease-in-out",
                      isExplainerEnabled ? "translate-x-7" : "translate-x-0"
                    )}
                  >
                    <span className="font-bold text-black">
                      <TextCursorInput className="size-5" />
                    </span>
                  </div>
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>AI Explainer</p>
            </TooltipContent>
          </Tooltip>

          <button
            onClick={() => {
              setChatOpen(!chatOpen);
              window.getSelection()?.removeAllRanges();
            }}
            className={`flex z-20 items-center justify-center p-5 text-white rounded-l-lg hover:bg-opacity-80 ${chatOpen ? "bg-gradient-to-tr from-appAIFrom to-appAITo" : "bg-gray2"}`}
          >
            <MessageSquare className="size-5" />
          </button>
        </div>
        <LessonChatbotModal isOpen={chatOpen} onClose={() => setChatOpen(!chatOpen)} lesson={lesson} />
      </>
    );
  }
);

LessonAiOrb.displayName = "LessonAiOrb";
