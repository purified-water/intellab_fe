import { courseAPI } from "@/lib/api/courseApi";
import React, { useState, useEffect, useRef } from "react";

interface RatingModalProps {
  closeModal: () => void;
  courseTitle: string;
  courseId: string;
  isReviewTab: boolean;
  onReviewSubmitted?: () => void; // optional callback
}

const RatingModal: React.FC<RatingModalProps> = ({
  closeModal,
  courseTitle,
  courseId,
  isReviewTab,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  //   const [isPromptVisible, setIsPromptVisible] = useState(false); // State to control modal visibility

  //   // Constants for timing logic
  //   const PROMPT_DELAY_DAYS = 7; // Show again after 7 days if dismissed
  //   const MAX_DISMISSALS = 3; // Stop showing after 3 dismissals

  //   // Function to check if we should show the review prompt
  //   const shouldShowReviewPrompt = () => {
  //     const storedData = JSON.parse(localStorage.getItem("reviewPrompt") || "{}");

  //     if (storedData[courseId]) {
  //       const { lastPromptDate, dismissCount, reviewed } = storedData[courseId];

  //       if (reviewed) return false; // Don't show if already reviewed
  //       if (dismissCount >= MAX_DISMISSALS) return false; // Don't show if dismissed too many times

  //       // Check if enough days have passed
  //       const lastDate = new Date(lastPromptDate);
  //       const now = new Date();
  //       const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24); // Calculate the difference in days

  //       return diffDays >= PROMPT_DELAY_DAYS;
  //     }
  //     return true; // Show the prompt for first-time completion
  //   };

  // Function to update localStorage when user interacts with the prompt
  const updateReviewPrompt = (action: "dismiss" | "reviewed") => {
    const storedData = JSON.parse(localStorage.getItem("reviewPrompt") || "{}") || {};
    const now = new Date();

    if (!storedData[courseId]) {
      storedData[courseId] = { lastPromptDate: now, dismissCount: 0, reviewed: false };
    }

    if (action === "dismiss") {
      storedData[courseId].dismissCount += 1;
      storedData[courseId].lastPromptDate = now;
    } else if (action === "reviewed") {
      storedData[courseId].reviewed = true;
    }

    localStorage.setItem("reviewPrompt", JSON.stringify(storedData));
  };

  //   // Check if the modal should be shown when the component mounts
  //   useEffect(() => {
  //     if (shouldShowReviewPrompt()) {
  //       setIsPromptVisible(true); // Show the modal if conditions are met
  //     }
  //   }, []);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId") || "";
      await courseAPI.postReview({
        rating,
        comment: reviewText,
        userUid: userId,
        courseId
      });
      setIsSuccess(true);
      setIsLoading(false);
      // Optionally close modal or reset state
      updateReviewPrompt("reviewed"); // Mark as reviewed when submitted
      onReviewSubmitted?.();
      closeModal();
    } catch (err) {
      setIsLoading(false);
      console.error("Error posting review:", err);
    }
  };

  // Adjust textarea height dynamically based on content length
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height before resizing
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [reviewText]);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg w-[800px] p-6 space-y-4 max-h-[600px] overflow-y-auto">
        {isLoading && <div>Loading...</div>}
        {isSuccess && <div>Review sent successfully!</div>}

        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <p className="text-2xl font-bold">{courseTitle}</p>
            {!isReviewTab && (
              <span>Congratulations! You have completed the course. Would you like to leave feedback?</span>
            )}
          </div>

          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => {
              updateReviewPrompt("dismiss");
              closeModal();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div>
          <div className="text-lg font-bold">Your review</div>
          <div className="flex items-center justify-start space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer ${rating >= star ? "text-yellow-500" : "text-gray-300"}`}
                onClick={() => handleRatingChange(star)}
              >
                ★
              </span>
            ))}
          </div>
          <div className="mt-2">
            <textarea
              ref={textareaRef}
              value={reviewText}
              onChange={handleTextChange}
              rows={1}
              className="w-full p-2 bg-white border border-gray-300 resize-none rounded-xl focus:outline-none"
              placeholder="Write your review (Optional)"
            />
          </div>
        </div>

        <div className="flex items-center justify-end mt-4">
          <button className="w-24 px-4 py-2 font-bold text-white rounded-xl bg-appPrimary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
