import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { ICertificate } from "../types";
import { useNavigate } from "react-router-dom";

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
      <div className="flex space-x-4 items-center text-sm">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="h-6 w-24" />
      </div>
    );
  } else {
    content = (
      <div className="flex space-x-4 items-center text-sm">
        <p className="text-lg underline hover:text-appPrimary cursor-pointer" onClick={handleCouseNameClick}>
          {certificate?.course.name}
        </p>
        <span className="px-2 py-1 text-white bg-black rounded-full text-xs">⭐ {certificate?.course.rating ?? 5}</span>
        <span> • {certificate?.course.reviewCount} reviews</span>
      </div>
    );
  }

  return content;
}
