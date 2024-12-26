export interface ICourse {
  courseId: string;
  courseLogo: string;
  courseName: string;
  description: string;
  level: string;
  price: number;
  unitPrice: string;
  userUid: string;
  lessonCount: number;
  averageRating: number;
  reviewCount: number;
  latestLessonId: string;
  progressPercent: number;
  userEnrolled: boolean;
}
