import { TCategory } from "./category";
import { PriceRange } from "./price";

export interface ICourse {
  averageRating: number | null;
  courseId: string;
  courseName: string;
  description: string;
  latestLessonId: string;
  lessonCount: number;
  level: string;
  price: number;
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
  enrollments: number | null;
}

export interface ICompletedCourse {
  course: ICourse;
  certificateId: string;
  completedDate: string;
}

export type TCourseFilter = {
  keyword: string;
  categories: TCategory[];
  rating: string | null;
  levels: string[];
  prices: string[];
  priceRange: PriceRange;
  isCompletedCreation: boolean;
};
