import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { ICertificate } from "../types";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

type CourseInformationSectionProps = {
  loading: boolean;
  certificate: ICertificate | null;
};

export function CourseInfomationSection(props: CourseInformationSectionProps) {
  const { loading, certificate } = props;
  const navigation = useNavigate();

  const handleCouseNameClick = () => {
    navigation(`/course/${certificate?.course.id}`);
  };

  let content = null;
  if (loading) {
    content = (
      <div className="flex items-center space-x-4 text-sm">
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-12 h-6 rounded-full" />
        <Skeleton className="w-24 h-6" />
      </div>
    );
  } else {
    content = (
      <div className="flex items-center space-x-4 text-sm">
        <p className="text-lg underline cursor-pointer hover:text-appPrimary" onClick={handleCouseNameClick}>
          {certificate?.course.name}
        </p>
        <div className="flex items-center px-2 py-1 rounded-lg bg-gray1 text-appMedium">
          <Star size={14} fill="currentColor" stroke="none" />
          <span className="ml-1 text-xs text-white ">{certificate?.course.rating ?? 5}</span>
        </div>
        <span> • {certificate?.course.reviewCount} reviews</span>
      </div>
    );
  }

  return content;
}
