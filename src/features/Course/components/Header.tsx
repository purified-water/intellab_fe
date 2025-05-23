// import { useRef, useState } from "react";
// import { ProgressBar, Spinner, AnimatedButton } from "@/components/ui";
// import { amountTransformer } from "@/utils";
// import { ICourse } from "@/types";
// import CourseSummaryDialog from "@/components/ui/CourseSummaryDialog";
// import { aiAPI } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { NA_VALUE } from "@/constants";
// import { showToastError } from "@/utils/toastUtils";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/rootReducer";
// import { PREMIUM_PACKAGES, PREMIUM_STATUS } from "@/constants";

// interface HeaderProps {
//   course: ICourse;
//   onEnroll: () => void;
//   onContinue: () => void;
//   onViewCertificate: () => void;
//   onPurchase: () => Promise<void>;
// }

// export const Header = (props: HeaderProps) => {
//   const { course, onEnroll, onContinue, onViewCertificate, onPurchase } = props;
//   const [showSummaryDialog, setShowSummaryDialog] = useState(false);
//   const [summaryContent, setSummaryContent] = useState("");
//   const toast = useToast();
//   const [loading, setLoading] = useState(false);
//   const abortControllerRef = useRef<AbortController | null>(null);
//   const formattedCourseName = course.courseName.replace(/[^a-zA-Z0-9]/g, " ").trim();

//   const isFinished = course.progressPercent == 100;

//   const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);
//   const isCurrentPlanActive = reduxPremiumStatus?.status == PREMIUM_STATUS.ACTIVE;
//   const includedInPremiumPlan =
//     reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.COURSE ||
//     reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.PREMIUM;

//   const renderReview = () => {
//     return (
//       <div className="mt-2 text-xs">
//         <span className="px-2 py-1 text-white bg-black rounded-full">
//           ⭐ {course.averageRating && course.averageRating != 0 ? course.averageRating.toFixed(1) : NA_VALUE}
//         </span>
//         <span> • {course.reviewCount ? amountTransformer(course.reviewCount) : 0} reviews</span>
//       </div>
//     );
//   };

//   const renderLeftButton = () => {
//     let buttonText;
//     let onClick;
//     let disable = false;

//     if (course.userEnrolled) {
//       if (isFinished) {
//         buttonText = "View Certificate";
//         onClick = onViewCertificate;
//         if (!course.certificateId || !course.certificateUrl) {
//           disable = true;
//         }
//       } else {
//         buttonText = "Continue";
//         onClick = onContinue;
//       }
//     } else {
//       if (course.price == 0 || (includedInPremiumPlan && isCurrentPlanActive)) {
//         buttonText = "Enroll";
//         onClick = onEnroll;
//       } else {
//         buttonText = "Purchase";
//         onClick = onPurchase;
//       }
//     }

//     return (
//       <button
//         disabled={disable}
//         className="px-6 py-2 text-base font-bold text-white bg-appPrimary rounded-lg hover:bg-appSecondary shadow transition"
//         onClick={onClick}
//       >
//         {buttonText}
//       </button>
//     );
//   };

//   const handleSummaryClick = async () => {
//     setLoading(true);
//     try {
//       // remove the special characters and the space at start and end from the course name
//       const response = await aiAPI.getCourseSummary(formattedCourseName, course.courseId, "false");
//       const { content } = response;
//       setSummaryContent(content);
//       setShowSummaryDialog(true);
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         showToastError({ toast: toast.toast, title: "Error", message: error.message ?? "Failed to get AI summary" });
//       }
//     }
//     setLoading(false);
//   };

//   const handleCancelClick = () => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }
//   };

//   const renderRightButton = () => {
//     return <AnimatedButton label="AI Summary" onClick={handleSummaryClick} />;
//   };

//   const renderButtons = () => {
//     return (
//       <div className="flex gap-4 mt-4">
//         {renderLeftButton()}
//         {isFinished && renderRightButton()}
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col gap-3 p-4 mx-24 my-6 text-white rounded-lg bg-gradient-to-r from-appPrimary to-appSecondary px-7 min-w-[500px]">
//       <h1 className="text-4xl font-bold">{course.courseName}</h1>
//       <p className="mt-2 text-justify">{course.description}</p>
//       {course.userEnrolled ? <ProgressBar progress={course.progressPercent} /> : renderReview()}
//       {renderButtons()}
//       <CourseSummaryDialog
//         courseName={formattedCourseName}
//         isOpen={showSummaryDialog}
//         summaryContent={summaryContent}
//         onClose={() => {
//           setShowSummaryDialog(false);
//           handleCancelClick();
//         }}
//       />
//       {loading && <Spinner overlay loading={loading} />}
//     </div>
//   );
// };

import { useRef, useState } from "react";
import { ProgressBar, AnimatedButton, Spinner } from "@/components/ui";
import { ICourse } from "@/types";
import { BookOpenText, Users } from "lucide-react";
import CourseSummaryDialog from "@/components/ui/CourseSummaryDialog";
import { aiAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const toast = useToast();
  const formattedCourseName = course.courseName.replace(/[^a-zA-Z0-9]/g, " ").trim();

  const coverImageUrl = course.courseImage ? course.courseImage : "/src/assets/unavailable_image.jpg";

  const isFinished = course.progressPercent == 100;

  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);
  const isCurrentPlanActive = reduxPremiumStatus?.status == PREMIUM_STATUS.ACTIVE;
  const includedInPremiumPlan =
    reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.COURSE ||
    reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.PREMIUM;

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
          console.log("Certificate ID or URL is missing");
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
        className="px-6 py-2 text-base font-bold text-white bg-appPrimary rounded-lg hover:bg-appPrimary/80 shadow transition"
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
        {isFinished && renderRightButton()}
      </div>
    );
  };

  return (
    <div className="relative w-screen pt-10 px-10 pb-4">
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

              <span className={`text-gray2 text-base max-w-2xl ${showFullDescription ? "" : "line-clamp-2"}`}>
                {course.description}
              </span>

              {course.description && course.description.length > 70 && (
                <button
                  className="text-appPrimary text-sm underline hover:text-appSecondary"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  type="button"
                >
                  {showFullDescription ? "Show less" : "View more"}
                </button>
              )}
              <div className="flex items-center gap-2 mt-2 mb-2">
                <span className="bg-gray5 text-black1 text-xs font-semibold px-2 py-1 rounded-[10px]">
                  {course.level}
                </span>
              </div>
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-2">
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
                  <span className="font-bold text-black1 ml-1">
                    {course.averageRating ? course.averageRating.toFixed(1) : "0"}
                  </span>
                  <span>({course.reviewCount ?? 0} reviews)</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="font-bold text-black1 ml-1">{course.numberOfEnrolledStudents ?? 0}</span> students
                </span>
                <span className="flex items-center gap-1">
                  <BookOpenText className="w-4 h-4" />
                  <span className="font-bold text-black1 ml-1">{course.lessonCount ?? 0}</span> lessons
                </span>
              </div>
              {course.userEnrolled ? (
                <div className="flex flex-col mb-4">
                  <div className="flex flex-row items-center justify-between mb-2">
                    <span className="text-sm text-black1 font-semibold">Progress</span>
                    <span className="text-sm text-black1 font-semibold">{course.progressPercent ?? 36.4}%</span>
                  </div>
                  <div className="flex-1">
                    <ProgressBar
                      progress={parseFloat((course.progressPercent ?? 36.4).toFixed(2))}
                      showText={false}
                      height={8}
                    />
                  </div>
                </div>
              ) : (
                <span className="text-md font-bold text-appPrimary inline-flex items-center gap-1">
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
