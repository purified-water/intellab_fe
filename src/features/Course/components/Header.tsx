import { useRef, useState, useEffect } from "react";
import { ProgressBar, AnimatedButton, Spinner } from "@/components/ui";
import { ICourse } from "@/types";
import { BookOpenText, Users } from "lucide-react";
import CourseSummaryDialog from "@/components/ui/CourseSummaryDialog";
import { aiAPI, courseAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { PREMIUM_PACKAGES, PREMIUM_STATUS } from "@/constants";
import clsx from "clsx";
import { CourseLevels, ProblemLevels } from "@/constants/enums/appLevels";

// Define certificate statuses
type CertificateStatus = "idle" | "generating" | "ready" | "failed";

interface HeaderProps {
  course: ICourse;
  onEnroll: () => void;
  onContinue: () => void;
  onViewCertificate: () => void;
  onPurchase: () => Promise<void>;
  onCertificateReady?: (updatedCourse: ICourse) => void;
}

export const Header = (props: HeaderProps) => {
  const { course, onEnroll, onContinue, onViewCertificate, onPurchase, onCertificateReady } = props;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const toast = useToast();
  const formattedCourseName = course.courseName.replace(/[^a-zA-Z0-9]/g, " ").trim();

  const coverImageUrl = course.courseImage
    ? `${course.courseImage}?timestamp=${new Date().getTime()}`
    : "/src/assets/unavailable_image.jpg";

  const isFinished = course.progressPercent == 100;

  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);
  const isCurrentPlanActive = reduxPremiumStatus?.status == PREMIUM_STATUS.ACTIVE;
  const includedInPremiumPlan =
    reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.COURSE ||
    reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.PREMIUM;

  // Certificate generation state management
  const [certificateStatus, setCertificateStatus] = useState<CertificateStatus>("idle");
  const [_retryCount, setRetryCount] = useState(0);
  const wasGenerating = useRef(false);
  const hasCertificateUrl = course.certificateUrl && course.certificateId;

  // This effect handles the certificate initialization and polling
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // First-time completion detection
    const isFirstTimeCompletion = isFinished && !hasCertificateUrl;

    // Initialize certificate generation if course is newly completed
    if (isFirstTimeCompletion && certificateStatus === "idle") {
      setCertificateStatus("generating");
      wasGenerating.current = true;

      // Show toast notification that certificate is being generated
      toast.toast({
        title: "Certificate is being generated",
        description: "Please wait while we prepare your certificate. This may take a moment."
      });
    }

    // Poll for certificate status when in generating state
    if (certificateStatus === "generating" && isFinished) {
      const checkCertificateStatus = async () => {
        try {
          // Make API call to check certificate status
          const response = await courseAPI.getCourseDetail(course.courseId);

          // Check if certificate is ready (i.e., certificate URL is available)
          if (response.result.certificateUrl && response.result.certificateId) {
            // Certificate is ready
            setCertificateStatus("ready");

            // Update course data with new certificate information
            if (onCertificateReady) {
              // Call the callback with the updated course to trigger page re-render
              onCertificateReady(response.result);
            }

            // Show success notification
            toast.toast({
              title: "Certificate Ready!",
              description: "Your certificate has been successfully generated."
            });

            clearInterval(intervalId);
          } else {
            // Certificate not ready yet, increment retry counter
            setRetryCount((prevCount) => {
              const newCount = prevCount + 1;

              // After some retries, show a pending message to reassure the user
              if (newCount === 3) {
                toast.toast({
                  title: "Still working on it",
                  description: "Your certificate is being processed. This might take a moment."
                });
              }

              // After several failed attempts, mark as failed
              if (newCount > 5) {
                setCertificateStatus("failed");
                clearInterval(intervalId);

                toast.toast({
                  title: "Certificate Generation Failed",
                  description: "We couldn't generate your certificate. Please try again later.",
                  variant: "destructive"
                });
              }

              return newCount;
            });
          }
        } catch (error) {
          console.error("Error checking certificate status:", error);

          setRetryCount((prevCount) => {
            const newCount = prevCount + 1;

            // After several failed attempts, mark as failed
            if (newCount > 5) {
              setCertificateStatus("failed");
              clearInterval(intervalId);

              toast.toast({
                title: "Certificate Generation Failed",
                description: "We couldn't generate your certificate. Please try again later.",
                variant: "destructive"
              });
            }

            return newCount;
          });
        }
      };

      // Initial check
      checkCertificateStatus();

      // Increase polling interval to reduce server load and re-renders
      intervalId = setInterval(checkCertificateStatus, 10000); // Changed from 5s to 10s
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isFinished, certificateStatus, hasCertificateUrl, course.courseId]); // Removed retryCount and toast from dependencies

  // Reset certificate status to generating when retry is clicked
  const handleRetryCertificate = async () => {
    // Show loading notification
    toast.toast({
      title: "Retrying certificate generation",
      description: "We're attempting to generate your certificate again."
    });

    setCertificateStatus("generating");
    setRetryCount(0);

    try {
      // Make an explicit API call to trigger certificate regeneration
      await courseAPI.regenerateCertificate(course.courseId);

      // Polling mechanism will continue to check the status
    } catch (error) {
      console.error("Failed to retry certificate generation:", error);
      toast.toast({
        title: "Error",
        description: "Failed to restart certificate generation. Please try again later.",
        variant: "destructive"
      });
      // Reset status to failed if the API call fails
      setCertificateStatus("failed");
    }
  };

  const renderLeftButton = () => {
    let buttonText;
    let onClick;
    let disable = false;

    if (course.userEnrolled) {
      if (isFinished) {
        // Special handling for certificate states
        if (certificateStatus === "generating") {
          return (
            <div className="flex gap-4">
              <button
                disabled
                aria-label="Generating Certificate"
                title="Please wait while we generate your certificate"
                className="px-6 py-2 text-base font-bold text-white bg-appPrimary/70 rounded-lg shadow transition flex items-center justify-center min-w-[180px]"
              >
                <span className="mr-2">Generating Certificate</span>
                <svg
                  className="w-4 h-4 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </button>
              {renderRightButton()}
            </div>
          );
        } else if (certificateStatus === "failed") {
          return (
            <button
              onClick={handleRetryCertificate}
              aria-label="Retry Certificate Generation"
              title="Click to try generating your certificate again"
              className="px-6 py-2 text-base font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 shadow transition min-w-[180px]"
            >
              Retry Certificate
            </button>
          );
        } else {
          // Default certificate view button (idle or ready states)
          buttonText = "View Certificate";
          onClick = onViewCertificate;

          // Disable if certificate isn't available yet
          if (!course.certificateId || !course.certificateUrl) {
            disable = true;
            buttonText = "Certificate Unavailable";
          }
        }
      } else {
        buttonText = "Continue";
        onClick = onContinue;
      }
    } else {
      if (course.price == 0 || (includedInPremiumPlan && isCurrentPlanActive)) {
        buttonText = "Enroll";
        onClick = onEnroll;
      } else {
        buttonText = "Purchase";
        onClick = onPurchase;
      }
    }

    return (
      <button
        disabled={disable}
        aria-label={buttonText}
        title={disable ? "Certificate not ready yet" : buttonText}
        className={`px-6 py-2 text-base font-bold text-white bg-appPrimary rounded-lg hover:bg-appPrimary/80 shadow transition flex items-center justify-center min-w-[150px] ${disable ? "opacity-60 cursor-not-allowed" : ""}`}
        onClick={onClick}
      >
        {buttonText}
      </button>
    );
  };

  const handleSummaryClick = async () => {
    setLoading(true);
    try {
      const response = await aiAPI.getCourseSummary(formattedCourseName, course.courseId, "false");
      const { content } = response;
      setSummaryContent(content);
      setShowSummaryDialog(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, title: "Error", message: error.message ?? "Failed to get AI summary" });
      }
    }
    setLoading(false);
  };

  const handleCancelClick = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const renderRightButton = () => {
    return <AnimatedButton label="AI Summary" onClick={handleSummaryClick} />;
  };

  const renderButtons = () => {
    return (
      <div className="flex gap-4 mt-4">
        {renderLeftButton()}
        {/* Only show AI Summary button when course is finished and certificate isn't in the process of generation */}
        {isFinished && certificateStatus !== "generating" && certificateStatus !== "failed" && renderRightButton()}
      </div>
    );
  };

  return (
    <div className="relative w-screen px-10 pt-10 pb-4">
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
          <div className="w-[500px] h-[280px] rounded-[10px] overflow-hidden shadow-md">
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

              <span className={`text-gray2 text-base max-w-2xl ${showFullDescription ? "" : "line-clamp-2"}`}>
                {course.description}
              </span>

              {course.description && course.description.length > 70 && (
                <button
                  className="text-sm underline text-appPrimary hover:text-appSecondary"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  type="button"
                >
                  {showFullDescription ? "Show less" : "View more"}
                </button>
              )}
              <div className="flex items-center gap-2 mt-2 mb-2">
                <span
                  className={clsx("rounded-lg bg-gray5 px-2 py-1 text-xs font-medium", {
                    "text-appEasy":
                      course.level.toLowerCase() === ProblemLevels.EASY ||
                      course.level.toLowerCase() === CourseLevels.BEGINNER,
                    "text-appMedium":
                      course.level.toLowerCase() === ProblemLevels.MEDIUM ||
                      course.level.toLowerCase() === CourseLevels.INTERMEDIATE,
                    "text-appHard":
                      course.level.toLowerCase() === ProblemLevels.HARD ||
                      course.level.toLowerCase() === CourseLevels.ADVANCED
                  })}
                >
                  {course.level}
                </span>
                {course.categories.map((category, index) => (
                  <span key={index} className="px-2 py-1 text-xs font-semibold rounded-lg bg-gray5 text-black1">
                    {category.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="flex items-center justify-start space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`cursor-pointer ${course.averageRating && parseFloat(course.averageRating.toFixed(1)) >= star ? "text-yellow-500" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-1 font-bold text-black1">
                    {course.averageRating ? course.averageRating.toFixed(1) : "0"}
                  </span>
                  <span>
                    ({course.reviewCount ?? 0} {(course.reviewCount ?? 0) <= 1 ? "review" : "reviews"})
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="ml-1 font-bold text-black1">{course.numberOfEnrolledStudents ?? 0}</span>{" "}
                  {(course.numberOfEnrolledStudents ?? 0) <= 1 ? "student" : "students"}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpenText className="w-4 h-4" />
                  <span className="ml-1 font-bold text-black1">{course.lessonCount ?? 0}</span> lesson
                  {(course.lessonCount ?? 0) > 1 ? "s" : ""}
                </span>
              </div>
              {course.userEnrolled ? (
                <div className="flex flex-col mb-4">
                  <div className="flex flex-row items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-black1">Progress</span>
                    <span className="text-sm font-semibold text-black1">
                      {course.progressPercent.toFixed(0) ?? 0.0}%
                    </span>
                  </div>
                  <div className="flex-1">
                    <ProgressBar progress={course.progressPercent ?? 0.0} showText={false} height={8} />
                  </div>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-md text-appPrimary">
                  {course.price === 0
                    ? "Free"
                    : includedInPremiumPlan && isCurrentPlanActive
                      ? "Included in Premium"
                      : `${course.price?.toLocaleString()} VND`}
                </span>
              )}
              {renderButtons()}
            </div>
          </div>
        </div>
      </div>
      <CourseSummaryDialog
        courseName={formattedCourseName}
        isOpen={showSummaryDialog}
        summaryContent={summaryContent}
        onClose={() => {
          setShowSummaryDialog(false);
          handleCancelClick();
        }}
      />
      {loading && <Spinner overlay loading={loading} />}
    </div>
  );
};
