import { TCategory } from "./category";
import { PriceRange } from "./price";

export interface ICourse {
  averageRating: number | null;
  courseId: string;
  courseName: string;
  description: string;
  latestLessonId: string;
  lessonCount: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number | null;
  progressPercent: number;
  reviewCount: number | null;
  unitPrice: string;
  userEnrolled: boolean;
  userUid: string | null;
  certificateUrl: string | null;
  certificateId: string | null;
  categories: TCategory[];
  isAvailable: boolean;
  currentCreationStep: number;
  currentCreationStepDescription: string;
  isCompletedCreation: boolean;
  courseImage: string;
  numberOfEnrolledStudents: number | null;
  createdAt: string;
}

export interface ICompletedCourse {
  course: ICourse;
  certificateId: string;
  completedDate: string;
}

export type TCourseFilter = {
  keyword: string;
  categories: TCategory[] | null;
  rating: string | null;
  levels: string[] | null;
  prices: string[] | null;
  priceRange: PriceRange | null;
  isCompletedCreation: boolean | null;
};
