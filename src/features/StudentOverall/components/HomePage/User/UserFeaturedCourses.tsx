import { FeaturedCourseCard } from "../Guest/FeaturedCourseCard";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/shadcn";
import { ArrowRight } from "lucide-react";
import { ICourse } from "@/types";
import { useNavigate } from "react-router-dom";
import { EmptyList } from "@/components/ui/EmptyList";

interface UserFeaturedCoursesProps {
  courses: ICourse[];
  isLoading?: boolean;
  type?: "featured" | "free";
  className?: string;
}

export const UserFeaturedCourses = ({ courses, isLoading, type = "featured", className }: UserFeaturedCoursesProps) => {
  const navigate = useNavigate();

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray1">
          {type === "featured" ? "Featured Courses" : "Free Courses"}
        </h2>
        <Button
          onClick={() => {
            navigate("/explore");
          }}
          variant="ghost"
          size="sm"
          className="gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-6 px-1 snap-x snap-mandatory">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="min-w-[300px] w-[370px] h-[320px] rounded-xl" />
              ))
            : courses.map((course) => (
                <div key={course.courseId} className="pb-4 snap-start">
                  <FeaturedCourseCard course={course} />
                </div>
              ))}
          {!isLoading && courses.length === 0 && (
            <EmptyList message="No courses available" className="w-full h-[320px] flex items-center justify-center" />
          )}
        </div>
      </div>
    </div>
  );
};
