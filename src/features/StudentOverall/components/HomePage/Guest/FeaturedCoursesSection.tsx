import { Button, EmptyList, Separator } from "@/components/ui";
import { HOME_PAGE } from "@/features/StudentOverall/constants/homePageStrings";
import { ArrowRight } from "lucide-react";
import { FeaturedCourseCard } from "./FeaturedCourseCard";
import { ICourse } from "@/types";
import { Skeleton } from "@/components/ui/shadcn";

interface FeaturedCoursesSectionProps {
  featuredCourses: ICourse[];
  freeCourses: ICourse[];
  isFetchingFeatured?: boolean;
  isFetchingFree?: boolean;
  className?: string;
}

const SkeletonCourses = () => {
  return Array.from({ length: 3 }).map((_, i) => (
    <Skeleton key={i} className="min-w-[300px] w-[370px] h-[320px] rounded-xl" />
  ));
};

export function FeaturedCoursesSection({
  featuredCourses,
  freeCourses,
  isFetchingFeatured,
  isFetchingFree
}: FeaturedCoursesSectionProps) {
  return (
    <section id="courses" className="py-20">
      <div className="container px-4 md:px-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-appPrimary/10 text-appPrimary">
              Courses
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {HOME_PAGE.COURSES.FEATURED_TITLE}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {HOME_PAGE.COURSES.FEATURED_DESCRIPTION}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-6 px-1 py-16 snap-x snap-mandatory">
            {isFetchingFeatured ? (
              <SkeletonCourses />
            ) : featuredCourses.length === 0 && !isFetchingFeatured ? (
              <EmptyList message="No featured courses available" />
            ) : (
              featuredCourses.length > 0 &&
              featuredCourses.map((course) => (
                <div key={course.courseId} className="snap-start">
                  <FeaturedCourseCard course={course} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Separator className="w-56 my-8" />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {HOME_PAGE.COURSES.FREE_TITLE}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {HOME_PAGE.COURSES.FREE_DESCRIPTION}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-6 px-1 py-16 snap-x snap-mandatory">
            {isFetchingFree ? (
              <SkeletonCourses />
            ) : freeCourses.length === 0 && !isFetchingFree ? (
              <EmptyList message="No free courses available" />
            ) : (
              freeCourses.length > 0 &&
              freeCourses.map((course) => (
                <div key={course.courseId} className="snap-start">
                  <FeaturedCourseCard course={course} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Button
            onClick={() => {
              window.location.href = "/explore";
            }}
            variant="outline"
            className="gap-2"
          >
            View all courses
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
