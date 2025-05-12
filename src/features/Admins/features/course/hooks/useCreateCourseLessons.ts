import { useMutation, useQuery } from "@tanstack/react-query";
import { adminCourseAPI } from "@/features/Admins/api";
import { useToast } from "@/hooks";
import { showToastError, showToastSuccess } from "@/utils";
import { useDispatch } from "react-redux";
import { DEFAULT_QUIZ } from "../constants";
import { setCreateLesson } from "@/redux/createCourse/createLessonSlice";

export const useCreateLesson = (courseId?: string, lessonId?: string) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const createLesson = useMutation({
    mutationFn: adminCourseAPI.postCreateCourseLesson,
    onSuccess: (data) => {
      dispatch(
        setCreateLesson({
          lessonName: "",
          lessonDescription: "",
          lessonContent: "",
          lessonId: data.lessonId,
          lessonOrder: data.lessonOrder,
          hasQuiz: false,
          hasProblem: false,
          lessonQuiz: DEFAULT_QUIZ,
          lessonProblemId: ""
        })
      );
      showToastSuccess({ toast: toast.toast, message: "Lesson created successfully" });
    },
    onError: () => {
      showToastError({ toast: toast.toast, message: "Error creating lesson" });
    }
  });

  const updateLesson = useMutation({
    mutationFn: adminCourseAPI.putCreateCourseLesson,
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Lesson updated successfully" });
    }
  });

  const deleteLesson = useMutation({
    mutationFn: adminCourseAPI.deleteCreateLesson,
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Lesson deleted successfully" });
    },
    onError: () => {
      showToastError({ toast: toast.toast, message: "Error deleting lesson" });
    }
  });

  const updateQuiz = useMutation({
    mutationFn: adminCourseAPI.putCreateCourseLessonQuiz,
    onError: () => {
      showToastError({ toast: toast.toast, message: "Error updating quiz" });
    }
  });

  const reorderLessons = useMutation({
    mutationFn: adminCourseAPI.putCreateCourseLessonReorder,
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Lessons reordered successfully" });
    },
    onError: () => {
      showToastError({ toast: toast.toast, message: "Error reordering lessons" });
    }
  });

  const getLessonList = useQuery({
    queryKey: ["createLesson", courseId, "lessonList"],
    queryFn: () => {
      if (!courseId) return Promise.resolve([]);
      return adminCourseAPI.getCreateCourseLessonList(courseId);
    },
    enabled: !!courseId
  });

  const getQuiz = useQuery({
    queryKey: ["createLesson", lessonId, "quizList"],
    queryFn: () => {
      if (!lessonId) return Promise.resolve(DEFAULT_QUIZ); // Initial value
      return adminCourseAPI.getCreateLessonQuizList(lessonId);
    },
    enabled: !!lessonId
  });

  const getProblems = useQuery({
    queryKey: ["createLesson", "problemList"],
    queryFn: adminCourseAPI.getCreateLessonProblemList
  });

  return { createLesson, updateLesson, deleteLesson, updateQuiz, reorderLessons, getLessonList, getQuiz, getProblems };
};
