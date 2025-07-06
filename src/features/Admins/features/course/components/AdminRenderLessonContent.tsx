import { useRef, useMemo } from "react";
import { CreateLessonSchema } from "../schemas";
import { parseContent, ContentBlockRenderer } from "@/components/LessonContent/SharedLessonComponents";

interface AdminRenderLessonContentProps {
  lesson: CreateLessonSchema;
}

export const AdminRenderLessonContent = ({ lesson }: AdminRenderLessonContentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse lesson content into blocks using the shared parser
  const contentBlocks = useMemo(() => {
    if (!lesson.lessonContent) return [];
    return parseContent(lesson.lessonContent);
  }, [lesson.lessonContent]);

  return (
    <div ref={containerRef} className="space-y-6">
      <ContentBlockRenderer blocks={contentBlocks} variant="simple" />
    </div>
  );
};
