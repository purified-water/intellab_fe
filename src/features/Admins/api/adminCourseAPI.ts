import { apiClient } from "@/lib/api/apiClient";
import {
  CreateCourseGeneralStepPayload,
  CreateCourseLessonStepPayload,
  CreateCourseFinalStepPayload,
  CreateCoursePreviewStepPayload,
  UpdateCourseLessonPayload,
  CreateCourseLessonQuizPayload,
  CreateLessonQuizResponse,
  QuestionResponse,
  CreateLessonProblemResponse
} from "@/types";
import { CreateQuizSchema } from "../features/course/schemas/createQuizSchema";
import { CreateLessonSchema } from "../features/course/schemas";
import {
  ILessonResponse,
  TUpdateCourseAvailabilityParams,
  TUpdateCourseAvailabilityResponse
} from "../features/course/types";
import { DEFAULT_QUIZ } from "../features/course/constants";
import { AxiosError } from "axios";
import { apiResponseCodeUtils } from "@/utils";

export const adminCourseAPI = {
  // Step 1
  postCreateCourseGeneralStep: async (payload: CreateCourseGeneralStepPayload) => {
    const response = await apiClient.post(`course/admin/courses/general-step`, payload);
    return response.data.result;
  },

  // Upload course image
  postCreateCourseThumbnail: async (courseId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(`course/admin/courses/${courseId}/image/upload-file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data.result;
  },

  putCreateCourseGeneralStep: async (courseId: string, payload: CreateCourseGeneralStepPayload) => {
    const response = await apiClient.put(`course/admin/courses/general-step/${courseId}`, payload);
    return response.data.result;
  },

  changeCourseImageLink: async (courseId: string, imageLink: string) => {
    const response = await apiClient.post(`course/admin/courses/${courseId}/image/link`, imageLink, {
      headers: {
        "Content-Type": "text/plain"
      }
    });
    return response.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const imageId = crypto.randomUUID();

    const response = await apiClient.post(`course/admin/courses/image/${imageId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data.result;
  },

  deleteCourseImage: async (courseId: string) => {
    const response = await apiClient.delete(`course/admin/courses/${courseId}/image`);
    return response.data.result;
  },

  // Step 2
  // Add a lesson (call first to init the lessonId)
  postCreateCourseLesson: async (payload: CreateCourseLessonStepPayload) => {
    const response = await apiClient.post(`course/admin/lessons`, payload);
    return response.data.result;
  },
  // After initializing the lessonId, we can update the lesson
  // NOTE: this API doesn't include updating quiz, its a separate API
  putCreateCourseLesson: async (payload: UpdateCourseLessonPayload) => {
    const response = await apiClient.put(`course/admin/lessons`, payload);
    return response.data;
  },
  // Add a quiz to the lesson
  putCreateCourseLessonQuiz: async (payload: CreateCourseLessonQuizPayload) => {
    const response = await apiClient.put(`course/admin/lessons/quiz`, payload);
    return response.data;
  },

  // Reorder the lessons
  putCreateCourseLessonReorder: async (payload: { courseId: string; lessonIds: string[] }) => {
    const response = await apiClient.put(`course/admin/lessons/lessonsOrder`, payload);
    return response.data;
  },

  // Step 3
  postCreateCourseFinalStep: async (courseId: string, payload: CreateCourseFinalStepPayload) => {
    const response = await apiClient.post(`course/admin/courses/final-step/${courseId}`, payload);
    return response.data;
  },

  putCreateCourseFinalStep: async (courseId: string, payload: CreateCourseFinalStepPayload) => {
    const response = await apiClient.put(`course/admin/courses/final-step/${courseId}`, payload);
    return response.data;
  },

  // Step 4
  putCreateCoursePreviewStep: async (courseId: string, payload: CreateCoursePreviewStepPayload) => {
    const response = await apiClient.put(
      `course/admin/courses/update-available-status/${courseId}?availableStatus=${payload.availableStatus}`
    );
    return response.data.result;
  },

  // HELPERS FOR CREATING A COURSE
  // Get the list of categories
  getCreateCourseCategories: async () => {
    const response = await apiClient.get(`course/courses/categories`);
    return response.data.result;
  },

  getCreateCourseLessonList: async (courseId: string): Promise<CreateLessonSchema[]> => {
    const response = await apiClient.get(`course/admin/courses/${courseId}/lessonsList`);
    const data = response.data.result as ILessonResponse[];

    return data.map((lesson: ILessonResponse) => ({
      lessonId: lesson.lessonId,
      lessonName: lesson.lessonName,
      lessonDescription: lesson.description,
      lessonContent: lesson.content,
      hasQuiz: lesson.quizId ? true : false,
      lessonQuiz: DEFAULT_QUIZ,
      hasProblem: lesson.problemId ? true : false,
      lessonProblemId: lesson.problemId ?? null,
      lessonOrder: lesson.lessonOrder ?? 0
    }));
  },

  getCreateCourseCertificateTemplates: async (templateIndex: number) => {
    const response = await apiClient.get(`course/admin/courses/certificate/template/${templateIndex}`);
    return response.data;
  },

  // HELPERS FOR CREATING A LESSON
  // Get the list of quiz of a lesson
  getCreateLessonQuizList: async (lessonId: string): Promise<CreateQuizSchema> => {
    const response = await apiClient.get(`course/admin/lessons/quiz/${lessonId}`);
    const data = response.data.result as CreateLessonQuizResponse;

    // Map the response to the CreateQuizSchema for UI
    return {
      totalQuestions: data.questionList.length,
      displayedQuestions: data.questionsPerExercise,
      requiredCorrectQuestions: data.passingQuestions,
      isQuizVisible: data.isQuizVisible,
      quizQuestions: data.questionList.map((question: QuestionResponse) => ({
        questionId: question.questionId,
        questionTitle: question.questionContent,
        correctAnswer: parseInt(question.correctAnswer),
        options: question.options.map((option) => ({
          order: option.order,
          option: option.content
        }))
      }))
    };
  },
  // Get the problem list when creating a lesson
  getCreateLessonProblemList: async (): Promise<CreateLessonProblemResponse[]> => {
    const response = await apiClient.get(`problem/problems/createLesson/problemList`);
    return response.data.result;
  },

  deleteCreateLesson: async (lessonId: string) => {
    const response = await apiClient.delete(`course/admin/lessons/${lessonId}`);
    return response.data;
  },

  updateCourseAvailability: async ({ query, onStart, onSuccess, onFail, onEnd }: TUpdateCourseAvailabilityParams) => {
    const DEFAULT_ERROR = "Error updating course availability";

    const handleResponseData = async (data: TUpdateCourseAvailabilityResponse) => {
      const { code, result, message } = data;
      if (apiResponseCodeUtils.isSuccessCode(code)) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    };

    if (onStart) {
      await onStart();
    }
    try {
      const { courseId, isAvailable } = query!;
      const response = await apiClient.put(
        `/course/admin/courses/update-available-status/${courseId}?availableStatus=${isAvailable}`
      );
      await handleResponseData(response.data as TUpdateCourseAvailabilityResponse);
    } catch (error: unknown) {
      if (error instanceof AxiosError && apiResponseCodeUtils.isAcceptedErrorCode(error.response?.status)) {
        await handleResponseData(error.response?.data as TUpdateCourseAvailabilityResponse);
      } else if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  postLessonImageInMarkdown: async (imageId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(`course/admin/courses/image/${imageId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data.result;
  },

  // Helper for editing a lesson
  deleteLessonQuestion: async (questionId: string) => {
    const response = await apiClient.delete(`course/admin/lessons/quiz/removeQuestion/${questionId}`);
    return response.data.result;
  }
};
