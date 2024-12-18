import { ICourse } from "@/features/Course/types";
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

export { DEFAULT_COURSE };
