import { AnimatedButton } from "@/components/ui";
import CourseSummaryDialog from "@/components/ui/CourseSummaryDialog";
import { useState } from "react";
import { Users, BookOpenText } from "lucide-react";
import { CreateCourseSchema } from "../../../schemas";
import { useFilePreview } from "@/hooks";

interface PreviewCourseHeaderProps {
  course: CreateCourseSchema;
}

export const PreviewCourseHeader = ({ course }: PreviewCourseHeaderProps) => {
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Use our custom hook to generate the thumbnail preview
  const thumbnailPreview = useFilePreview(course.courseThumbnail ? course.courseThumbnail : null);

  // Use the preview from our hook, or fallback to default image
  const coverImageUrl = thumbnailPreview || "/src/assets/unavailable_image.jpg";

  const renderButtons = () => {
    return (
      <div className="flex gap-8 mt-6">
        <button className="px-6 py-1 bg-appPrimary text-white font-semibold rounded-lg shadow transition">
          View Certificate
        </button>

        <AnimatedButton label="AI Summary" onClick={() => setShowSummaryDialog(true)} />
      </div>
    );
  };

  return (
    <div className="relative w-full pt-10 px-5 pb-4">
      {/* Background with blurred course image */}
      <div className="absolute inset-0 w-full h-96 overflow-hidden z-0 rounded-lg">
        <img
          src={coverImageUrl}
          alt="background"
          className="w-full h-full object-cover opacity-100"
          style={{ filter: "blur(100px)" }}
          onError={(e) => (e.currentTarget.src = "/src/assets/unavailable_image.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
      </div>

      {/* Content */}
      <div className="flex flex-col w-full items-center pt-10 pb-5 px-4 relative z-8">
        <div className="flex flex-row items-center w-full max-w-6xl gap-5 bg-white rounded-2xl shadow-md p-10">
          {/* Left: Cover Image */}
          <div className="w-96 h-72 rounded-[10px] overflow-hidden shadow-md">
            <img
              src={coverImageUrl}
              alt={course.courseName}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/src/assets/unavailable_image.jpg")}
            />
          </div>
          {/* Right: Course Info */}
          <div className="flex flex-col flex-1 justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.courseName}</h1>

              <span className={`text-gray2 text-base ml-1 max-w-2xl ${showFullDescription ? "" : "line-clamp-2"}`}>
                {course.courseDescription}
              </span>

              {course.courseDescription && course.courseDescription.length > 70 && (
                <button
                  className="text-appPrimary text-base text-bold underline hover:text-appSecondary"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  type="button"
                >
                  {showFullDescription ? "Show less" : "View more"}
                </button>
              )}
              <div className="flex items-center gap-2 mt-5 mb-2">
                <span className="bg-gray5 text-black1 text-xs font-semibold px-2 py-1 rounded-[10px]">
                  {course.courseLevel || "Beginner"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-2">
                <span className="flex items-center gap-1">
                  <div className="flex items-center justify-start space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`cursor-pointer ${5 >= star ? "text-yellow-500" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-bold text-black1">5</span>
                  <span>({0} reviews)</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    <span className="font-bold text-black1">{110}</span> students
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <BookOpenText className="w-4 h-4" />
                  <span>
                    <span className="font-bold text-black1">{course.courseLessons.length ?? 0}</span> lessons
                  </span>
                </span>
              </div>
              {renderButtons()}
            </div>
          </div>
        </div>
      </div>
      <CourseSummaryDialog
        courseName={course.courseName}
        isOpen={showSummaryDialog}
        summaryContent={"Description"}
        onClose={() => {
          setShowSummaryDialog(false);
        }}
      />
    </div>
  );
};
