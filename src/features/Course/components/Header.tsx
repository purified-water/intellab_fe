import { ProgressBar } from "@/components/ui/ProgressBar";
import { amountTransformer } from "@/utils";

interface HeaderProps {
  title: string;
  description: string;
  isEnrolled: boolean;
  rating: number;
  reviews: number;
  progress: number;
  onEnroll: () => void;
  onContinue: () => void;
  onViewCertificate: () => void;
}

export const Header = (props: HeaderProps) => {
  const { title, description, isEnrolled, rating, reviews, progress, onEnroll, onContinue, onViewCertificate } = props;

  const completed = progress == 100;

  const renderReview = () => {
    return (
      <div className="mt-2 text-xs">
        <span className="px-2 py-1 text-white bg-black rounded-full">⭐ {rating}</span>
        <span> • {reviews != null ? amountTransformer(reviews) : amountTransformer(reviews)} reviews</span>
      </div>
    );
  };

  const renderButton = () => {
    let buttonText;
    let onClick;
    let width;
    if (!isEnrolled) {
      buttonText = "Enroll";
      onClick = onEnroll;
      width = 100;
    } else {
      if (completed) {
        buttonText = "View Certificate";
        onClick = onViewCertificate;
        width = 200;
      } else {
        buttonText = "Continue";
        onClick = onContinue;
        width = 120;
      }
    }

    return (
      <button
        className="px-4 py-2 mt-6 text-base font-bold text-black bg-white rounded-lg w-28 hover:bg-gray-300 "
        style={{ width: width }}
        onClick={onClick}
      >
        {buttonText}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-3 p-4 mx-24 my-6 text-white rounded-lg bg-gradient-to-r from-appPrimary to-appSecondary px-7">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-2 text-justify">{description}</p>
      {isEnrolled ? <ProgressBar progress={progress} /> : renderReview()}
      {renderButton()}
    </div>
  );
};
