import { AnimatedButton } from "@/components/ui";
import CourseSummaryDialog from "@/components/ui/CourseSummaryDialog";
import { useState } from "react";
import { Users, BookOpenText } from "lucide-react";
import { CreateCourseSchema } from "../../../schemas";
import { useFilePreview } from "@/hooks";
import clsx from "clsx";
import { CourseLevels, ProblemLevels } from "@/constants/enums/appLevels";
import { PreviewCertificate } from "./PreviewCertificate";
import { useCreateFinalStep } from "../../../hooks";

interface PreviewCourseHeaderProps {
  course: CreateCourseSchema;
}

export const PreviewCourseHeader = ({ course }: PreviewCourseHeaderProps) => {
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const createCourseFinalStep = useCreateFinalStep(course.courseId, Number(course.courseCertificate));
  const { data: templateCertificate, isLoading: isLoadingCertificate } = createCourseFinalStep.getCertificateTemplates;
  console.log("templateCertificate", templateCertificate);
  // Use our custom hook to generate the thumbnail preview
  const thumbnailPreview = useFilePreview(course.courseThumbnail ? course.courseThumbnail : null);

  // Use the preview from our hook, or fallback to default image
  const coverImageUrl = thumbnailPreview || "/src/assets/unavailable_image.jpg";

  const renderButtons = () => {
    return (
      <div className="flex gap-8 mt-6">
        <button
          type="button"
          className="px-6 py-1 font-semibold text-white transition rounded-lg shadow bg-appPrimary"
          onClick={() => setShowCertificateModal(true)}
        >
          View Certificate
        </button>

        <AnimatedButton label="AI Summary" onClick={() => setShowSummaryDialog(true)} />
      </div>
    );
  };

  return (
    <div className="relative w-full px-5 pt-10 pb-4">
      {/* Background with blurred course image */}
      <div className="absolute inset-0 z-0 w-full overflow-hidden rounded-lg h-96">
        <img
          src={coverImageUrl}
          alt="background"
          className="object-cover w-full h-full opacity-100"
          style={{ filter: "blur(100px)" }}
          onError={(e) => (e.currentTarget.src = "/src/assets/unavailable_image.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center w-full px-4 pt-10 pb-5 z-8">
        <div className="flex flex-row items-start w-full max-w-6xl gap-5 p-10 bg-white shadow-md rounded-2xl">
          {/* Left: Cover Image */}
          <div className="w-96 h-72 rounded-[10px] overflow-hidden shadow-md">
            <img
              src={coverImageUrl}
              alt={course.courseName}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = "/src/assets/unavailable_image.jpg")}
            />
          </div>
          {/* Right: Course Info */}
          <div className="flex flex-col justify-between flex-1">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{course.courseName}</h1>

              <div className="overflow-hidden">
                <span
                  className={`text-gray2 text-base max-w-2xl transition-all duration-300 ease-in-out ${showFullDescription ? "max-h-none" : "line-clamp-2"}`}
                >
                  {course.courseDescription}
                </span>
              </div>

              {course.courseDescription && course.courseDescription.length > 70 && (
                <button
                  className="mt-1 text-sm underline transition-colors duration-200 text-appPrimary hover:text-appSecondary"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  type="button"
                >
                  {showFullDescription ? "Show less" : "View more"}
                </button>
              )}
              <div className="flex items-center gap-2 mt-5 mb-2 flex-wrap">
                <span
                  className={clsx("rounded-lg bg-gray5 px-2 py-1 text-xs font-medium", {
                    "text-appEasy":
                      course.courseLevel.toLowerCase() === ProblemLevels.EASY ||
                      course.courseLevel.toLowerCase() === CourseLevels.BEGINNER,
                    "text-appMedium":
                      course.courseLevel.toLowerCase() === ProblemLevels.MEDIUM ||
                      course.courseLevel.toLowerCase() === CourseLevels.INTERMEDIATE,
                    "text-appHard":
                      course.courseLevel.toLowerCase() === ProblemLevels.HARD ||
                      course.courseLevel.toLowerCase() === CourseLevels.ADVANCED
                  })}
                >
                  {course.courseLevel}
                </span>
                {course.courseCategories.map((category, index) => (
                  <span key={index} className="px-2 py-1 text-xs font-semibold rounded-lg bg-gray5 text-black1">
                    {category.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="flex items-center justify-start space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`cursor-pointer ${"text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-bold text-black1">0</span>
                  <span>
                    ({0} {"review"})
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    <span className="font-bold text-black1">{0}</span> {"student"}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <BookOpenText className="w-4 h-4" />
                  <span>
                    <span className="font-bold text-black1">{course.courseLessons.length ?? 0}</span> lesson
                    {(course.courseLessons.length ?? 0) > 1 ? "s" : ""}
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
        summaryContent={course.courseSummary}
        onClose={() => {
          setShowSummaryDialog(false);
        }}
      />

      {/* Certificate Modal */}
      {showCertificateModal && (
        <PreviewCertificate
          certificateUrl={templateCertificate}
          onClose={() => setShowCertificateModal(false)}
          isLoading={isLoadingCertificate}
        />
      )}
    </div>
  );
};
