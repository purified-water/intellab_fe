// Subtypes for creating a course
export interface Category {
  categoryId: number;
  name: string;
}
interface OptionRequest {
  order: number;
  content: string;
}
interface Question {
  questionId: string;
  questionContent: string;
  correctAnswer: string;
  questionType: string;
  optionRequests: OptionRequest[];
}

// Main types for creating a course
// Step 1: General Information
export interface CreateCourseGeneralStepPayload {
  courseName: string;
  description: string;
  level: string;
  categoryIds: string[];
}

// Step 2: Lessons - Create a lesson will update the course
// For adding a lesson
export interface CreateCourseLessonStepPayload {
  courseId: string;
  cloneLessonId: string | null;
}

// For updating a lesson - No quiz
export interface UpdateCourseLessonPayload {
  lessonId: string;
  lessonOrder: number;
  lessonName: string | null;
  description: string | null;
  content: string | null;
  problemId: string | null;
}

// For adding a quiz to a lesson
export interface CreateCourseLessonQuizPayload {
  lessonId: string;
  quizId: string | null;
  questionsPerExercise: number;
  passingQuestions: number;
  questions: Question[];
}

// The lesson format after calling post with step
export interface CreateCourseLessonStepResponse {
  lessonId: string;
  content: string | null;
  description: string | null;
  lessonOrder: number;
  lessonName: string | null;
  courseId: string;
  quizId: string | null;
  problemId: string | null;
}

// Step 3: Final steps
export interface CreateCourseFinalStepPayload {
  price: number;
  unitPrice: string;
  templateCode: number;
}

// Step 4: Preview and publish
export interface CreateCoursePreviewStepPayload {
  availableStatus: boolean;
}
// Course response after calling post with step
export interface CreateCourseResponseType {
  courseId: string;
  courseName: string;
  description: string;
  level: string;
  price: number;
  unitPrice: number | null;
  userUid: string | null;
  reviewCount: number;
  averageRating: number;
  lessonCount: number;
  isAvailable: boolean;
  currentCreationStep: number;
  currentCreationStepDescription: string;
  isCompletedCreation: boolean;
  courseImage: string | null;
  categories: Category[];
}

// HELPERS TYPES FOR CREATING A LESSON
export interface CreateLessonProblemResponse {
  problemId: string;
  problemName: string;
  description: string;
  level: string;
  categories: Category[];
}
