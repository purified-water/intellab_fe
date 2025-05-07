import { CreateCourseSchema } from "../schemas";
import { ICreateCourse } from "../types";
import { TCategory } from "@/types";

export const mapCreateCourseToICreateCourse = (state: CreateCourseSchema): ICreateCourse => ({
  averageRating: null,
  courseId: state.courseId,
  courseName: state.courseName,
  description: state.courseDescription,
  latestLessonId: "", // set appropriately
  lessonCount: state.courseLessons.length,
  level: state.courseLevel,
  price: state.coursePrice || 0,
  progressPercent: 0,
  reviewCount: null,
  unitPrice: state.coursePrice?.toFixed(2) || "0.00",
  userEnrolled: false,
  userUid: null,
  certificateUrl: null,
  certificateId: state.courseCertificate.toString(),
  categories: state.courseCategories as unknown as TCategory[],
  isAvailable: state.courseMakeAvailable,
  currentCreationStep: 0,
  currentCreationStepDescription: "",
  isCompletedCreation: false,
  courseImage: state.courseThumbnail as unknown as string,
  enrollments: null,
  summaryContent: state.courseSummary
});
