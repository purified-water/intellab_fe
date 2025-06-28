import { CreateQuizSchema } from "../schemas/createQuizSchema";
import { ICreateCourse } from "../types";

const DEFAULT_CREATE_COURSE: ICreateCourse = {
  averageRating: 4.5,
  courseId: "course_id",
  courseName: "Course Name",
  description: "Course Description",
  latestLessonId: "latest_lesson_id",
  lessonCount: 0,
  level: "Beginner",
  price: 0,
  unitPrice: "VND",
  progressPercent: 25.6,
  reviewCount: 1000,
  userEnrolled: false,
  userUid: null,
  certificateId: "",
  certificateUrl: "",
  categories: [],
  summaryContent: "Summary Content",
  courseImage: "",
  isAvailable: false,
  isCompletedCreation: false,
  numberOfEnrolledStudents: 0,
  currentCreationStep: 0,
  currentCreationStepDescription: "Current Creation Step Description",
  createdAt: new Date().toISOString()
};

const DEFAULT_CREATE_COURSE_LESSONS = [
  {
    lessonId: "lesson_id",
    lessonOrder: 0,
    lessonName: "Lesson Name",
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit",
    content: "Lesson Content",
    courseId: "course_id",
    exerciseId: "exercise_id",
    isDoneTheory: false,
    isDonePractice: false,
    learningId: "learning_id",
    nextLessonId: "next_lesson_id",
    nextLessonName: "Next Lesson Name",
    problemId: ""
  },
  {
    lessonId: "lesson_id_2",
    lessonOrder: 1,
    lessonName: "Lesson Name 2",
    description: "...",
    content: "Lesson Content 2",
    courseId: "course_id",
    exerciseId: "exercise_id_2",
    isDoneTheory: false,
    isDonePractice: false,
    learningId: "learning_id_2",
    nextLessonId: "next_lesson_id_2",
    nextLessonName: "Next Lesson Name 2",
    problemId: "2"
  },
  {
    lessonId: "lesson_id_3",
    lessonOrder: 2,
    lessonName: "Lesson Name 3",
    description: "...",
    content: "Lesson Content 3",
    courseId: "course_id",
    exerciseId: "exercise_id_3",
    isDoneTheory: false,
    isDonePractice: false,
    learningId: "learning_id_3",
    nextLessonId: "next_lesson_id_3",
    nextLessonName: "Next Lesson Name 3",
    problemId: "1"
  }
];

const DEFAULT_QUIZ: CreateQuizSchema = {
  totalQuestions: 1,
  displayedQuestions: 1,
  isQuizVisible: true,
  requiredCorrectQuestions: 1,
  quizQuestions: [
    {
      questionId: "",
      questionTitle: "Question Title",
      correctAnswer: 1,
      options: [
        { order: 1, option: "Option 1" },
        { order: 2, option: "Option 2" },
        { order: 3, option: "Option 3" },
        { order: 4, option: "Option 4" }
      ]
    }
  ]
};

export { DEFAULT_CREATE_COURSE, DEFAULT_CREATE_COURSE_LESSONS, DEFAULT_QUIZ };
