import { ICourse, ILesson } from "@/features/Course/types";
import hierarchy from "@/assets/hierarchy.png";

const DEFAULT_COURSE: ICourse = {
  averageRating: 4.5,
  courseId: "course_id",
  courseLogo: hierarchy,
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
  userUid: null
};

const DEFAULT_LESSON: ILesson = {
  lessonId: "lesson_id",
  lessonOrder: 0,
  lessonName: "Lesson Name",
  description: "Lesson Description",
  content: "Lesson Content",
  courseId: "course_id",
  exerciseId: "exercise_id",
  isDoneTheory: false,
  isDonePractice: false,
  learningId: "learning_id",
  nextLessonId: "next_lesson_id",
  nextLessonName: "Next Lesson Name"
};

export { DEFAULT_COURSE, DEFAULT_LESSON };
