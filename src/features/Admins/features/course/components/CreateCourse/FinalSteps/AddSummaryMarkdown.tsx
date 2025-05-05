import { FormLabel, Textarea } from "@/components/ui/shadcn";
import { RequiredInputLabel } from "../RequiredInputLabel";
import { useState } from "react";
import { RenderMarkdown } from "@/components/Markdown";
import { AnimatedButton } from "@/components/ui";

interface AddSummaryMarkdownProps {
  value: string;
  onChange: (value: string) => void;
}
export const AddSummaryMarkdown = ({ value, onChange }: AddSummaryMarkdownProps) => {
  const [isEditing, setIsEditing] = useState(true);

  const renderButtonRow = () => {
    return (
      <div className="flex gap-2 p-1 text-xs font-medium rounded-lg bg-appPrimary">
        <button
          type="button"
          className={`px-3 py-2 rounded transition-colors duration-300 ${isEditing ? "bg-white text-black" : "text-white"}`}
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          type="button"
          className={`px-3 py-2 rounded transition-colors duration-300 ${!isEditing ? "bg-white text-black" : "text-white"}`}
          onClick={() => setIsEditing(false)}
        >
          Preview
        </button>
      </div>
    );
  };

  const renderLessonContent = () => {
    if (isEditing) {
      return (
        <Textarea
          className="w-full h-[500px] p-2 border rounded-lg max-h-[700px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    } else {
      return (
        <div className="w-full h-[500px] p-2 border rounded-lg max-h-[700px] overflow-auto">
          <RenderMarkdown content={value} />
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4 space-x-4">
        <div className="flex flex-col gap-2">
          <FormLabel>
            <RequiredInputLabel className="mb-2" label="Summary Content" />
          </FormLabel>
          <div className="text-sm text-muted-foreground">
            Note: Provide a summary for your entire course. This will appear after the user has completed the course.
          </div>
        </div>

        <AnimatedButton className="[&_svg]:size-4" label="Summarize with AI" onClick={() => {}} />
      </div>

      <div className="flex items-center mb-4 space-x-4">{renderButtonRow()}</div>

      {renderLessonContent()}
    </div>
  );
};
