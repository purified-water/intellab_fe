import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CreateLessonSchema } from "../schemas";
import { AdminLessonHeader, AdminRenderLessonContent, AdminLessonNavigation } from "../components";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

export const AdminLessonDetailPage = () => {
  const [lesson, setLesson] = useState<CreateLessonSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const courseData = searchParams.get("courseData");

  useEffect(() => {
    if (id && courseData) {
      try {
        const parsedCourseData = JSON.parse(decodeURIComponent(courseData));
        const foundLesson = parsedCourseData.courseLessons?.find(
          (lesson: CreateLessonSchema) => lesson.lessonId === id
        );

        if (foundLesson) {
          setLesson(foundLesson);
          // Set document title
          document.title = `${foundLesson.lessonName} - Admin Preview | Intellab`;
        }

        setLoading(false);
      } catch (error) {
        console.error("Error parsing course data:", error);
        setLoading(false);
      }
    }
  }, [id, courseData]);

  const getNextLesson = () => {
    if (!lesson || !courseData) return null;

    try {
      const parsedCourseData = JSON.parse(decodeURIComponent(courseData));
      const lessons = parsedCourseData.courseLessons || [];
      const currentIndex = lessons.findIndex((l: CreateLessonSchema) => l.lessonId === lesson.lessonId);

      if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
        return lessons[currentIndex + 1];
      }
    } catch (error) {
      console.error("Error finding next lesson:", error);
    }

    return null;
  };

  const renderSkeleton = () => {
    return (
      <div className="space-y-8">
        <Skeleton className="h-56 bg-gray5" />
        <Skeleton className="h-6 bg-gray5" />
        <Skeleton className="h-6 bg-gray5" />
        <Skeleton className="h-6 bg-gray5" />
        <Skeleton className="h-6 bg-gray5" />
        <Skeleton className="w-24 h-8 bg-gray5" />
      </div>
    );
  };

  const renderContent = () => {
    if (!lesson) return null;

    return (
      <div className="space-y-6">
        <AdminLessonHeader lesson={lesson} />
        <AdminRenderLessonContent lesson={lesson} />
        <AdminLessonNavigation lesson={lesson} nextLesson={getNextLesson()} courseData={courseData} />
      </div>
    );
  };

  return (
    <div className="flex justify-center p-6 sm:pl-24 md:pl-40 md:pr-24">
      <div className="w-full max-w-[1400px]">{loading ? renderSkeleton() : renderContent()}</div>
    </div>
  );
};
