import { ICertificate } from "../types";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { NA_VALUE } from "@/constants/defaultData";

type CourseInformationSectionProps = {
  loading: boolean;
  certificate: ICertificate | null;
};

export function CourseInformationSection(props: CourseInformationSectionProps) {
  const { loading, certificate } = props;
  const navigation = useNavigate();

  const handleGoToCourse = () => {
    navigation(`/course/${certificate?.course.id}`);
  };

  let content = null;
  if (loading) {
    content = (
      <div className="items-center p-4 space-y-3 text-white rounded-lg bg-gradient-to-r from-appPrimary to-appSecondary">
        <Skeleton className="w-3/4 h-8" />
        <div className="flex items-center space-x-2">
          <Skeleton className="w-12 h-6" />
          <Skeleton className="w-24 h-6" />
        </div>
        <Skeleton className="w-32 h-10" />
      </div>
    );
  } else {
    content = (
      <div className="items-center py-4 space-y-3 text-white rounded-lg px-7 bg-gradient-to-tr from-appPrimary to-appSecondary">
        <p className="text-2xl font-bold">{certificate?.course.name}</p>
        <div className="flex items-center space-x-2">
          <div className="flex items-center px-2 py-1 rounded-lg bg-gray1 text-appMedium">
            <Star size={14} fill="currentColor" stroke="none" />
            <span className="ml-1 text-xs text-white ">{certificate?.course.rating?.toFixed(1) ?? NA_VALUE}</span>
          </div>
          <span> • {certificate?.course.reviewCount} reviews</span>
        </div>
        <Button type="button" variant={"white"} size={"white"} onClick={handleGoToCourse}>
          Go to course
        </Button>
      </div>
    );
  }

  return content;
}
