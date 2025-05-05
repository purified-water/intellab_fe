interface Category {
  id: string;
  name: string;
}

// Step 1: General Information
export interface CreateCourseGeneralStepPayload {
  courseName: string;
  description: string;
  level: string;
  categoryIds: string[];
}

export interface CreateCourseResponseType {
  courseId: string;
  courseName: string;
  description: string;
  level: string;
  price: number;
  unitPrice: number | null;
  userUid: string | null;
  reviewCount: number;
  averageRating: number;
  lessonCount: number;
  isAvailable: boolean;
  currentCreationStep: number;
  currentCreationStepDescription: string;
  isCompletedCreation: boolean;
  courseImage: string | null;
  categories: Category[];
}
