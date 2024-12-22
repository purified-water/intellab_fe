import { ICourse, ILesson } from "@/features/Course/types";
import hierarchy from "@/assets/hierarchy.png";

const DEFAULT_COURSE: ICourse = {
  courseId: "course_id",
  courseName: "Course Name",
  description: "Course Description",
  level: "Beginner",
  price: 0,
  unitPrice: "đ",
  courseLogo: hierarchy,
  userUid: "",
  userEnrolled: false,
  lessonNumber: 0,
  rating: 0,
  reviews: 0,
  progress: 0
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
