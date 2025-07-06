import React, { useRef, useMemo, useEffect } from "react";
import { LessonHeader } from "./LessonHeader";
import { ILesson } from "@/types";
import { TOCItem } from "./TableOfContents";
import { parseContent, extractTOC, ContentBlockRenderer } from "@/components/LessonContent/SharedLessonComponents";

// Main component for rendering a lesson
export const RenderLessonMarkdown: React.FC<{
  lesson: ILesson;
  setTocItems: (items: TOCItem[]) => void;
}> = ({ lesson, setTocItems }) => {
  const blocks = useMemo(() => parseContent(lesson.content), [lesson.content]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Extract TOC items using the shared function
    const tocItems = extractTOC(lesson.content);
    setTocItems(tocItems);
  }, [lesson.content, setTocItems]);

  return (
    <div className="mb-8">
      <LessonHeader lesson={lesson} />
      <div className="lesson-content markdown" ref={contentRef}>
        <ContentBlockRenderer blocks={blocks} variant="original" />
      </div>
    </div>
  );
};

RenderLessonMarkdown.displayName = "RenderLessonMarkdown";
