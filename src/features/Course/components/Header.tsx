import { ProgressBar } from "./ProgressBar";
import { amountTransformer } from "@/utils";

interface HeaderProps {
  title: string;
  description: string;
  isEnrolled: boolean;
  rating: number;
  reviews: number;
  onEnroll: () => void;
}

export const Header = (props: HeaderProps) => {
  const { title, description, isEnrolled, rating, reviews, onEnroll } = props;

  const renderReview = () => {
    return (
      <div className="text-xs mt-2">
        <span className="px-2 py-1 text-white bg-black rounded-full">⭐ {rating}</span>
        <span> • {amountTransformer(reviews)} reviews</span>
      </div>
    );
  };

  return (
    <div className="p-4 text-white bg-gradient-to-r from-appPrimary to-appSecondary rounded-lg flex flex-col gap-3 mx-14 my-6 px-7">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-2">{description}</p>
      {isEnrolled ? <ProgressBar progress={36.4} /> : renderReview()}
      {!isEnrolled && (
        <button
          className="px-4 py-2 text-base font-bold text-black bg-white rounded-lg w-28 hover:bg-gray-300 mt-4"
          onClick={onEnroll}
        >
          Enroll
        </button>
      )}
      {isEnrolled && (
        <button className="px-4 py-2 text-base font-bold text-black bg-white rounded-lg w-28 hover:bg-gray-300 mt-6">
          Continue
        </button>
      )}
    </div>
  );
};
