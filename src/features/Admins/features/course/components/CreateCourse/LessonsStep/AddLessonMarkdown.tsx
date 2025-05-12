import { Textarea } from "@/components/ui/shadcn";
import { useState } from "react";
import { RenderMarkdown } from "@/components/Markdown";

interface AddLessonMarkdownProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}
export const AddLessonMarkdown = ({ value, onChange, readOnly }: AddLessonMarkdownProps) => {
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
          className="w-full h-[600px] p-2 border rounded-lg max-h-[2000px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={readOnly}
        />
      );
    } else {
      return (
        <div className="w-full h-[600px] p-2 border rounded-lg max-h-[2000px] overflow-auto">
          <RenderMarkdown content={value} />
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4 space-x-4">
        {renderButtonRow()}
        <div className="text-sm">Drag and drop image to upload</div>
      </div>

      {renderLessonContent()}
    </div>
  );
};
