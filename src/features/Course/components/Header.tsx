import { useRef, useState } from "react";
import { ProgressBar, Spinner, AnimatedButton } from "@/components/ui";
import { amountTransformer } from "@/utils";
import { ICourse } from "@/types";
import CourseSummaryDialog from "@/components/ui/CourseSummaryDialog";
import { aiAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { NA_VALUE } from "@/constants";
import { showToastError } from "@/utils/toastUtils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { PREMIUM_PACKAGES, PREMIUM_STATUS } from "@/constants";

interface HeaderProps {
  course: ICourse;
  onEnroll: () => void;
  onContinue: () => void;
  onViewCertificate: () => void;
  onPurchase: () => Promise<void>;
}

export const Header = (props: HeaderProps) => {
  const { course, onEnroll, onContinue, onViewCertificate, onPurchase } = props;
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const formattedCourseName = course.courseName.replace(/[^a-zA-Z0-9]/g, " ").trim();

  const isFinished = course.progressPercent == 100;

  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);
  const isCurrentPlanActive = reduxPremiumStatus?.status == PREMIUM_STATUS.ACTIVE;
  const includedInPremiumPlan =
    reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.COURSE ||
    reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.PREMIUM;

  const renderReview = () => {
    return (
      <div className="mt-2 text-xs">
        <span className="px-2 py-1 text-white bg-black rounded-full">
          ⭐ {course.averageRating != 0 ? course.averageRating.toFixed(1) : NA_VALUE}
        </span>
        <span> • {amountTransformer(course.reviewCount)} reviews</span>
      </div>
    );
  };

  const renderLeftButton = () => {
    let buttonText;
    let onClick;
    let disable = false;

    if (course.userEnrolled) {
      if (isFinished) {
        buttonText = "View Certificate";
        onClick = onViewCertificate;
        if (!course.certificateId || !course.certificateUrl) {
          disable = true;
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
        className="px-6 py-1 text-lg font-bold text-black bg-white rounded-lg hover:bg-gray-300 "
        onClick={onClick}
      >
        {buttonText}
      </button>
    );
  };

  const handleSummaryClick = async () => {
    setLoading(true);
    try {
      // remove the special characters and the space at start and end from the course name
      const response = await aiAPI.getCourseSummary(formattedCourseName, course.courseId, "false");
      const { content } = response;
      setSummaryContent(content);
      setShowSummaryDialog(true);
    } catch (error) {
      showToastError({ toast: toast.toast, title: "Error", message: error.message ?? "Failed to get AI summary" });
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
      <div className="flex gap-8 mt-6">
        {renderLeftButton()}
        {isFinished && renderRightButton()}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 p-4 mx-24 my-6 text-white rounded-lg bg-gradient-to-r from-appPrimary to-appSecondary px-7 min-w-[500px]">
      <h1 className="text-4xl font-bold">{course.courseName}</h1>
      <p className="mt-2 text-justify">{course.description}</p>
      {course.userEnrolled ? <ProgressBar progress={course.progressPercent} /> : renderReview()}
      {renderButtons()}
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
