import { ICourse, ILesson } from "@/types";

const DEFAULT_COURSE: ICourse = {
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
  categories: []
};

const DEFAULT_LESSON: ILesson = {
  lessonId: "lesson_id",
  lessonOrder: 0,
  lessonName: "Lesson Name",
  description: "...",
  content: "Lesson Content",
  courseId: "course_id",
  exerciseId: "exercise_id",
  isDoneTheory: false,
  isDonePractice: false,
  learningId: "learning_id",
  nextLessonId: "next_lesson_id",
  nextLessonName: "Next Lesson Name",
  problemId: ""
};

const NA_VALUE = "N/A";

export { DEFAULT_COURSE, DEFAULT_LESSON, NA_VALUE };
