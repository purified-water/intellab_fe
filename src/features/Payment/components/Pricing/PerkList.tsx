import { Unlock, FileText, MessageCircleCode, Bot, TextCursorInput, Sparkle } from "lucide-react";

const ICONS = {
  "Access to All Problems": Unlock,
  "Access to All Courses": Unlock,
  "Intellab AI Assistant": Sparkle,
  "AI-Powered Course Summarization": FileText,
  "Unlimited Interaction with the AI Assistant for Problem Solving": MessageCircleCode,
  "Access to Cutting-Edge AI Models": Bot,
  "Real-time AI Explainer Within Lessons": TextCursorInput
};

interface Perk {
  title:
    | "Access to All Problems"
    | "Access to All Courses"
    | "Intellab AI Assistant"
    | "AI-Powered Course Summarization"
    | "Unlimited Interaction with the AI Assistant for Problem Solving"
    | "Access to Cutting-Edge AI Models"
    | "Real-time AI Explainer Within Lessons";
  description: string;
}
interface PerksListProps {
  perks: Perk[];
}

export const PerksList = ({ perks }: PerksListProps) => {
  return (
    <div className="w-[511px] pr-5 inline-flex flex-col justify-start items-start gap-5 overflow-hidden mt-12">
      {perks.map((perk, index) => {
        const Icon = ICONS[perk.title as keyof typeof ICONS] || Unlock;
        return (
          <div key={index} className="self-stretch inline-flex justify-start items-start gap-2.5">
            <Icon className="w-5 h-5 text-appPrimary" />
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-[5px]">
              <div className="self-stretch justify-start text-base font-semibold text-black">{perk.title}</div>
              <div className="self-stretch justify-start text-base font-light text-black">{perk.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
