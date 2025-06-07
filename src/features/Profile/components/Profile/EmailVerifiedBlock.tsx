import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { CircleCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

type EmailVerifiedBlock = {
  loading: boolean;
};

export function EmailVerifiedBlock(props: EmailVerifiedBlock) {
  const { loading } = props;

  const navigate = useNavigate();

  const handleBackHomePageClick = () => {
    navigate("/");
  };

  const renderContent = () => {
    return (
      <div className="w-full justify-items-center">
        <p className="text-3xl font-semibold text-appEasy">Email Verified</p>
        <CircleCheck size={100} className="my-2 text-appEasy" />
        <p className="text-center">
          Congratulations! You have successfully verified your email address. You can continue using the application.
        </p>
        <Button
          type="button"
          className="font-bold mt-14 bg-appPrimary hover:bg-appPrimary/80"
          onClick={handleBackHomePageClick}
        >
          Back to Home Page
        </Button>
      </div>
    );
  };

  const renderSkeleton = () => {
    return (
      <div className="w-full justify-items-center">
        <Skeleton className="w-64 h-8 mb-4" />
        <Skeleton className="w-24 h-24 my-2 rounded-full" />
        <Skeleton className="w-full h-6 mb-4" />
        <Skeleton className="w-3/4 h-6 mb-4" />
        <Skeleton className="w-48 h-12 mt-20" />
      </div>
    );
  };

  return (
    <div className="bg-white px-10 py-8 justify-items-center w-[500px] text-gray2 rounded-md shadow-md">
      {loading ? renderSkeleton() : renderContent()}
    </div>
  );
}
