import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCourseAPI } from "@/features/Admins/api";
import { useToast } from "@/hooks";
import { showToastError, showToastSuccess } from "@/utils";
import { useDispatch } from "react-redux";
import { DEFAULT_QUIZ } from "../constants";
import { setCreateLesson } from "@/redux/createCourse/createLessonSlice";

export const useCreateLesson = (courseId?: string, lessonId?: string) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["createLesson", lessonId, "quizList"] });
      showToastSuccess({ toast: toast.toast, message: "Quiz updated successfully" });
    },
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

  const deleteLessonQuestion = useMutation({
    mutationFn: async (questionId: string) => {
      if (!questionId) throw new Error("Question ID is required");
      const response = await adminCourseAPI.deleteLessonQuestion(questionId);
      return response;
    },
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Question removed successfully" });
    },
    onError: () => {
      showToastError({ toast: toast.toast, message: "Error in removing question" });
    }
  });

  return {
    createLesson,
    updateLesson,
    deleteLesson,
    updateQuiz,
    reorderLessons,
    getLessonList,
    getQuiz,
    getProblems,
    deleteLessonQuestion
  };
};
