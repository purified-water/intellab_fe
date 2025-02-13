import { Card } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/Button";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RatingModal from "./RatingModal";
import { IReview } from "@/pages/HomePage/types/reviewResponse";
import { courseAPI } from "@/lib/api/courseApi";

const allReviews = [
  //   {
  //     name: "Tuan Nguyen",
  //     rating: 5,
  //     date: "Jan 25, 2025",
  //     text: "Nunc enim lectus, pharetra ut blandit sed, convallis sit amet felis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
  //   },
  {
    name: "Tuan Nguyen",
    rating: 5,
    date: "Jan 25, 2025",
    text: "Nunc enim lectus, pharetra ut blandit sed, convallis sit amet felis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin est eros, semper lacinia sollicitudin at, dapibus vitae ex. Proin sed sagittis nisi, et tempus nisl. Integer vel est tellus. In sagittis orci eu augue dignissim gravida eu et dolor. Donec maximus arcu lorem, ac posuere lectus maximus sed. Vestibulum blandit quis metus...s"
  },
  {
    name: "Tuan Nguyen",
    rating: 4,
    date: "Jan 25, 2025",
    text: "Nunc enim lectus, pharetra ut blandit sed, convallis sit amet felis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
  },
  {
    name: "Tuan Nguyen",
    rating: 3,
    date: "Jan 25, 2025",
    text: "Nunc enim lectus, pharetra ut blandit sed, convallis sit amet felis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
  },
  {
    name: "Tuan Nguyen",
    rating: 5,
    date: "Jan 26, 2025",
    text: "Proin est eros, semper lacinia sollicitudin at, dapibus vitae ex. Proin sed sagittis nisi, et tempus nisl. Integer vel est tellus."
  },
  {
    name: "Tuan Nguyen",
    rating: 4,
    date: "Jan 26, 2025",
    text: "In sagittis orci eu augue dignissim gravida eu et dolor. Donec maximus arcu lorem, ac posuere lectus maximus sed. Vestibulum blandit quis metus."
  }
  // Add more reviews as necessary
];

export default function Reviews({ courseTitle, courseId }: { courseTitle: string; courseId: string }) {
  const [reviewsToShow, setReviewsToShow] = useState(3);
  const [expandedReview, setExpandedReview] = useState<number | null>(null); // Track which review is expanded
  const [reviews, setReviews] = useState<IReview[]>([]);

  const handleViewMore = () => {
    setReviewsToShow((prev) => prev + 3); // Load 3 more reviews each time
  };

  const handleShowMore = (index: number) => {
    // Toggle the expanded review state
    setExpandedReview((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await courseAPI.getReviews(courseId); // calls your getReviews function
        // Assuming response.result.content is your reviews array
        setReviews(response.result.content || []);
        console.log("REVIEWS", response.result.content);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const ratings = [
    { stars: 5, percentage: 60 },
    { stars: 4, percentage: 36 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 1 }
  ];

  return (
    <div className="mx-20 mt-6 overflow-hidden">
      <div className="flex items-start">
        <div className="flex flex-col flex-1 w-full">
          <div className="flex items-end space-x-2 text-xl font-bold">
            <span className="text-yellow-500">★</span>
            <span>4.5</span>
            <span className="text-sm text-gray-500">1,000 reviews</span>
          </div>
          <div>
            {ratings.map((rating, index) => (
              <div key={index} className="inline-flex items-center mt-3 space-x-2 w-72">
                <span className="font-bold">{rating.stars} stars</span>
                <div className="w-40 h-2 overflow-hidden bg-gray-200 rounded">
                  <motion.div
                    className="h-full rounded bg-appPrimary"
                    initial={{ width: 0 }}
                    animate={{ width: `${rating.percentage}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  ></motion.div>
                </div>
                <span>{[60, 36, 3, 0, 1][index]}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start grow-0">
          <Button className="w-32 text-sm text-white rounded-lg bg-appPrimary" onClick={openModal}>
            Add Review
          </Button>
          {isModalOpen && (
            <RatingModal closeModal={closeModal} courseTitle={courseTitle} courseId={courseId} isReviewTab={true} />
          )}
          <div className="space-y-4">
            {allReviews.slice(0, reviewsToShow).map((review, index) => (
              <Card key={index} className="w-full p-4 mt-4 border border-gray4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <div className="flex items-center">
                        <div className="text-yellow-500">
                          <Star size={14} fill="currentColor" stroke="none" />
                        </div>
                        <span className="pl-1 text-xs font-bold text-black">{review.rating}</span>
                      </div>
                      <span>·</span>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className={`mt-2 text-gray-700 text-sm ${expandedReview === index ? "" : "line-clamp-3"}`}>
                  {review.text}
                </p>
                {review.text.length > 200 && (
                  <button className="mt-2 text-xs text-appPrimary" onClick={() => handleShowMore(index)}>
                    {expandedReview === index ? "Show Less" : "Show More"}
                  </button>
                )}
              </Card>
            ))}
          </div>
          {reviewsToShow < allReviews.length && (
            <button className="mt-4 text-sm underline text-appPrimary" onClick={handleViewMore}>
              View more...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
