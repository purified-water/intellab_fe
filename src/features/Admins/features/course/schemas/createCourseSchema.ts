import { z } from "zod";
import { CREATE_COURSE_THUMBNAIL_MAX_SIZE } from "@/constants";
import { createLessonSchema } from "./createLessonSchema";

export const createCourseSchema = z.object({
  courseId: z.string(),
  courseName: z.string().min(1, { message: "Course name is required" }).max(100, {
    message: "Course name must be less than 100 characters"
  }),
  courseDescription: z.string().min(1, { message: "Course description is required" }).max(800, {
    message: "Course description must be less than 800 characters"
  }),
  courseCategories: z
    .array(
      z.object({
        categoryId: z.number(),
        name: z.string()
      })
    )
    .refine((categories) => categories.length > 0, {
      message: "At least one category is required"
    }),
  courseLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  courseThumbnail: z
    .instanceof(File)
    .nullable()
    .refine((file) => file && file.size <= CREATE_COURSE_THUMBNAIL_MAX_SIZE, {
      message: `Image size must be less than ${CREATE_COURSE_THUMBNAIL_MAX_SIZE / (1024 * 1024)}MB`
    })
    .optional(),
  courseLessons: z.array(createLessonSchema).refine((lessons) => lessons.length > 0, {
    message: "At least one lesson is required"
  }),

  coursePrice: z.number().optional(),
  courseSummary: z.string().min(1, { message: "Course summary is required" }).max(3000, {
    message: "Course summary must be less than 1500 characters"
  }),
  courseCertificate: z.number().min(1, { message: "Certificate template is required" }),
  courseMakeAvailable: z.boolean()
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;
export type CreateCourseSchemaWithId = CreateCourseSchema & {
  courseId: string;
};
export type CreateCourseSchemaWithCurrentStep = CreateCourseSchema & {
  currentCreationStep: number;
};
