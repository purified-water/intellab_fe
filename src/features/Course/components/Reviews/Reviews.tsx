import { Card } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui";
import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import RatingModal from "../RatingModal";
import { IReview, ReviewStatsResult } from "@/features/StudentOverall/types";
import { courseAPI } from "@/lib/api/courseApi";
import { Spinner } from "@/components/ui";
import ComboboxDemo from "../ComboboxDemo";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";

export function Reviews({
  courseTitle,
  courseId,
  hasCompleted
}: {
  courseTitle: string;
  courseId: string;
  hasCompleted: boolean;
}) {
  const [totalElements, setTotalElements] = useState(0);
  const [expandedReview, setExpandedReview] = useState<number | null>(null); // Track which review is expanded
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const size = 3; // number of reviews per page
  const hasFetched = useRef(false);
  const [reviewStats, setReviewStats] = useState<ReviewStatsResult | null>(null);
  const [ratingFilterOpen, setRatingFilterOpen] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("all");

  const handleShowMore = (index: number) => {
    // Toggle the expanded review state
    setExpandedReview((prev) => (prev === index ? null : index));
  };

  const fetchReviews = async (
    isIncrease: boolean = true,
    numOfElements: number = size,
    expectedPage: number = page,
    refetch: boolean = false
  ) => {
    try {
      setLoading(true);
      if (refetch) {
        const response = await courseAPI.getReviews(courseId, 0, numOfElements, ratingFilter);
        setReviews([...response.result.content]);
        setPage(1);
        setTotalElements(response.result.totalElements);
        return;
      }
      const response = await courseAPI.getReviews(courseId, expectedPage, numOfElements, ratingFilter);

      // Assuming response.result.content is the reviews array
      if (numOfElements === 1) {
        setReviews((prev) => [...response.result.content, ...prev]);
      } else {
        setReviews((prev) => [...prev, ...response.result.content]);
      }
      if (isIncrease) {
        setPage((prevPage) => prevPage + 1);
      }
      setTotalElements(response.result.totalElements);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    const response = await courseAPI.getReviewStats(courseId);
    setReviewStats(response.result);
  };

  const fetchRatingFilter = async (numOfElements: number = size) => {
    const response = await courseAPI.getReviews(courseId, 0, numOfElements, ratingFilter);
    setReviews(response.result.content);
    setPage(1);
    setTotalElements(response.result.totalElements);
  };

  useEffect(() => {
    // Set loading
    setLoading(true);

    fetchRatingFilter();
    fetchReviewStats();
    // Stop loading
    setLoading(false);
    if (!hasFetched.current) {
      hasFetched.current = true;
    }
  }, [ratingFilter]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mt-6 overflow-hidden">
      <div className="flex items-start">
        <div className="flex flex-col flex-1 w-full">
          <div className="flex items-end space-x-2 text-xl font-bold">
            <span className="text-yellow-500">★</span>
            <span>{reviewStats?.averageRating.toFixed(1) ?? 0}</span>
            <span className="text-sm text-gray-500">{reviewStats?.totalReviews ?? 0} reviews</span>
          </div>
          <div>
            {[
              reviewStats?.percentageFiveStar,
              reviewStats?.percentageFourStar,
              reviewStats?.percentageThreeStar,
              reviewStats?.percentageTwoStar,
              reviewStats?.percentageOneStar
            ].map((rating, index) => (
              <div key={index} className="inline-flex items-center mt-3 space-x-2 w-72">
                <span className="font-bold">{5 - index} stars</span>
                <div className="w-40 h-2 overflow-hidden rounded bg-gray6">
                  <motion.div
                    className="h-full rounded bg-appPrimary"
                    initial={{ width: 0 }}
                    animate={{ width: `${rating}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  ></motion.div>
                </div>
                <span>{rating?.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start w-full ml-4">
          <div className="flex items-end justify-between w-full">
            <ComboboxDemo
              open={ratingFilterOpen}
              setOpen={setRatingFilterOpen}
              value={ratingFilter}
              setValue={setRatingFilter}
            ></ComboboxDemo>

            {hasCompleted && hasFetched.current && (
              <Button
                className="w-32 mr-4 text-sm font-semibold text-white rounded-lg bg-appPrimary hover:bg-appPrimary/80"
                onClick={openModal}
              >
                Add Review
              </Button>
            )}
          </div>
          {reviews.length === 0 && !loading && (
            <div className="w-full mt-2">
              <div className="justify-items-center">
                <p className="mt-10 text-xl text-gray3">No reviews yet</p>
              </div>
            </div>
          )}
          {isModalOpen && (
            <RatingModal
              closeModal={closeModal}
              courseTitle={courseTitle}
              courseId={courseId}
              isReviewTab={true}
              onReviewSubmitted={() => {
                fetchReviews(true, size, page, true);
                fetchReviewStats();
              }}
            />
          )}
          <div className="mt-2 space-y-4 overflow-y-auto max-h-[800px] w-full">
            {reviews.map((review, index) => (
              <Card key={review.reviewId} className="w-full p-4 mt-4 border">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full">
                    {review.photoUrl ? (
                      <img
                        src={review.photoUrl}
                        alt="Avatar"
                        className="object-cover w-full h-full rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_AVATAR;
                        }}
                      />
                    ) : (
                      <img src={DEFAULT_AVATAR} alt="Avatar" className="object-cover w-full h-full rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{review.displayName ? review.displayName : "Tester"}</h4>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <div className="flex items-center">
                        <div className="text-yellow-500">
                          <Star size={14} fill="currentColor" stroke="none" />
                        </div>
                        <span className="pl-1 text-xs font-bold text-black">{review.rating}</span>
                      </div>
                      <span>·</span>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <p
                  className={`mt-2 text-gray-700 w-full break-words text-sm ${expandedReview === index ? "" : "line-clamp-3"}`}
                >
                  {review.comment}
                </p>
                {review.comment.length > 200 && (
                  <button type="button" className="mt-2 text-xs text-appPrimary" onClick={() => handleShowMore(index)}>
                    {expandedReview === index ? "Show Less" : "Show More"}
                  </button>
                )}
              </Card>
            ))}
          </div>
          {reviews.length < totalElements && (
            <button type="button" className="mt-4 text-sm underline text-appPrimary" onClick={() => fetchReviews(true)}>
              View more...
            </button>
          )}
          {loading && (
            <div className="w-full">
              <Spinner loading={loading}></Spinner>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
