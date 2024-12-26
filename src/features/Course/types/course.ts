export interface ICourse {
  averageRating: number;
  courseId: string;
  courseLogo: string;
  courseName: string;
  description: string;
  latestLessonId: string;
  lessonCount: number;
  level: string;
  price: number;
  progressPercent: number;
  reviewCount: number;
  unitPrice: string;
  userEnrolled: boolean;
  userUid: string | null;
}