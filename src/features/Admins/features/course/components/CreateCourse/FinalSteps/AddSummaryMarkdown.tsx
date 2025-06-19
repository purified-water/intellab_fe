import { FormLabel, Textarea } from "@/components/ui/shadcn";
import { RequiredInputLabel } from "@/features/Admins/components";
import { useState } from "react";
import { RenderMarkdown } from "@/components/Markdown";
import { AnimatedButton, Spinner } from "@/components/ui";
import { aiAPI } from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useToast } from "@/hooks/use-toast";
import { showToastError, showToastSuccess } from "@/utils";

interface AddSummaryMarkdownProps {
  value: string;
  onChange: (value: string) => void;
}

export const AddSummaryMarkdown = ({ value, onChange }: AddSummaryMarkdownProps) => {
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(false);

  // Get course data from Redux store
  const courseData = useSelector((state: RootState) => state.createCourse);
  const toast = useToast();

  const handleSummaryClick = async () => {
    if (!courseData.courseId || !courseData.courseName) {
      showToastError({
        toast: toast.toast,
        title: "Error",
        message: "Course information is missing. Please complete the general step first."
      });
      return;
    }

    setLoading(true);
    try {
      // Format course name to remove special characters
      const formattedCourseName = courseData.courseName.replace(/[^a-zA-Z0-9]/g, " ").trim();

      // Call AI API to generate course summary
      const response = await aiAPI.getCourseSummary(formattedCourseName, courseData.courseId, "true");
      const { content } = response;

      // Update the textarea with the generated content
      onChange(content);

      // Show success message
      showToastSuccess({
        toast: toast.toast,
        title: "Success",
        message: "AI summary generated successfully!"
      });

      // Switch to edit mode to show the generated content
      setIsEditing(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({
          toast: toast.toast,
          title: "Error",
          message: error.message ?? "Failed to generate AI summary"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderButtonRow = () => {
    return (
      <div className="flex gap-2 p-1 text-xs font-medium rounded-lg bg-appPrimary">
        <button
          type="button"
          disabled={loading}
          className={`px-3 py-2 rounded transition-colors duration-300 ${
            isEditing ? "bg-white text-black" : "text-white"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          type="button"
          disabled={loading}
          className={`px-3 py-2 rounded transition-colors duration-300 ${
            !isEditing ? "bg-white text-black" : "text-white"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
        <div className="relative">
          <Textarea
            className="w-full h-[300px] p-2 border rounded-lg max-h-[700px]"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={loading}
            placeholder={loading ? "Generating AI summary..." : "Enter your course summary here..."}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Spinner loading={true} />
                <span className="text-sm font-medium bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                  Generating AI summary...
                </span>
              </div>
            </div>
          )}
        </div>
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
        </div>

        <AnimatedButton 
          className="[&_svg]:size-4" 
          label={loading ? "Generating..." : "Summarize with AI"} 
          onClick={handleSummaryClick} 
          disabled={loading}
        />
      </div>

      <div className="flex items-center mb-4 space-x-4">{renderButtonRow()}</div>

      {renderLessonContent()}

      <div className="mt-2 text-[0.8rem] text-muted-foreground">
        Note: Provide a summary for your entire course. This will appear after the user has completed the course to help
        them reflect on what they have learned.
      </div>
    </div>
  );
};
