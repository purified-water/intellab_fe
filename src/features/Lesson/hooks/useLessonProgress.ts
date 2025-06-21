import { useState, useEffect, useRef, useCallback } from "react";
import { courseAPI } from "@/lib/api";
import { clearBookmark } from "@/utils";
import { ILesson } from "@/types";

interface UseLessonProgressProps {
  lesson: ILesson | null;
  userId: string | null;
}

export const useLessonProgress = ({ lesson, userId }: UseLessonProgressProps) => {
  const [hasQuiz, setHasQuiz] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [isLessonDone, setIsLessonDone] = useState(false);
  const theoryUpdateAttempted = useRef(false);

  // Check if the lesson has a quiz and if the lesson is done
  useEffect(() => {
    if (lesson?.exerciseId) {
      setHasQuiz(true);
    }
    if (lesson?.isDoneTheory) {
      setIsLessonDone(true);
    }
  }, [lesson]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.body.scrollHeight;
      const clientHeight = window.innerHeight;

      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
      if (scrollPercentage >= 75) {
        setIsScrolledToBottom(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Check right after the component mounts
    // to see if the user is already scrolled down (case the lesson is short)
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const updateTheoryDone = useCallback(async () => {
    // Only update if the lesson is not done and the user has scrolled to the bottom
    if (!theoryUpdateAttempted.current && lesson && !isLessonDone) {
      try {
        // Update the lesson progress only if the user has scrolled to the bottom
        // and the lesson does not have a quiz
        if (!hasQuiz && isScrolledToBottom && lesson.learningId && lesson.courseId) {
          theoryUpdateAttempted.current = true; // Mark as attempted

          const response = await courseAPI.updateTheoryDone(lesson.learningId, lesson.courseId);
          if (response && response.result) {
            if (userId && lesson.lessonId) {
              clearBookmark(userId, lesson.lessonId);
            }
            setIsLessonDone(true);
          } else {
            theoryUpdateAttempted.current = false; // Reset the flag if the update fails
          }
        }
      } catch (error) {
        console.error("Error updating theory done", error);
        theoryUpdateAttempted.current = false;
      }
    }
  }, [hasQuiz, isScrolledToBottom, lesson, isLessonDone, userId]);

  useEffect(() => {
    updateTheoryDone();
  }, [updateTheoryDone]);

  useEffect(() => {
    theoryUpdateAttempted.current = false;
  }, [lesson?.lessonId]);

  const resetProgress = () => {
    setIsScrolledToBottom(false);
    setIsLessonDone(false);
    theoryUpdateAttempted.current = false;
  };

  return { hasQuiz, isScrolledToBottom, isLessonDone, updateTheoryDone, resetProgress, setIsLessonDone };
};
