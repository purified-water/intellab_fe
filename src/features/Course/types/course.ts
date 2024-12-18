export interface ICourse {
  courseId: string;
  courseName: string;
  description: string;
  level: string;
  price: number;
  unitPrice: string;
  courseLogo: string;
  userUid: string;
  userEnrolled: boolean;
  lessonNumber: number;
  rating: number;
  reviews: number;
  progress: number;
}
