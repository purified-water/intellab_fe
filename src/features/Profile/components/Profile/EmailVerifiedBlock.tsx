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
      <div className="justify-items-center w-full">
        <p className="text-3xl font-semibold text-appEasy">Email Verified</p>
        <CircleCheck size={100} className="text-appEasy my-2" />
        <p className="text-center">
          Congratulations! You have successfully verified your email address. You can continue using the application.
        </p>
        <Button className="mt-14 font-bold bg-appPrimary hover:bg-appPrimary/80" onClick={handleBackHomePageClick}>
          Back to Home Page
        </Button>
      </div>
    );
  };

  const renderSkeleton = () => {
    return (
      <div className="justify-items-center w-full">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-24 w-24 rounded-full my-2" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-12 w-48 mt-20" />
      </div>
    );
  };

  return (
    <div className="bg-white px-10 py-8 justify-items-center w-[500px] text-gray2 rounded-md shadow-md">
      {loading ? renderSkeleton() : renderContent()}
    </div>
  );
}
