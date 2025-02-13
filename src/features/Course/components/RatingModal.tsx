import React, { useState, useEffect, useRef } from "react";

interface RatingModalProps {
  closeModal: () => void;
  courseTitle: string;
  courseId: string;
  isReviewTab: boolean;
}

const RatingModal: React.FC<RatingModalProps> = ({ closeModal, courseTitle, courseId, isReviewTab }) => {
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
  };

  // Adjust textarea height dynamically based on content length
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height before resizing
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [reviewText]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg w-[800px] p-6 space-y-4 max-h-[600px] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-bold">{courseTitle}</h3>
            {!isReviewTab && (
              <span>Congratulations! You have completed the course. Would you like to leave feedback?</span>
            )}
          </div>

          <button className="text-gray-500 hover:text-gray-700" onClick={closeModal}>
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
          <div className="font-bold">Your review</div>
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
          <button className="w-24 px-4 py-2 font-bold text-white rounded-xl bg-appPrimary">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
