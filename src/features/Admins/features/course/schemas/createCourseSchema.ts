import { z } from "zod";
import { CREATE_COURSE_THUMBNAIL_MAX_SIZE } from "@/constants";
import { createLessonSchema } from "./createLessonSchema";

export const createCourseSchema = z.object({
  courseId: z.string(),
  courseName: z.string().min(1, { message: "Course name is required" }).max(50, {
    message: "Course name must be less than 50 characters"
  }),
  courseDescription: z.string().min(1, { message: "Course description is required" }).max(100, {
    message: "Course name must be less than 100 characters"
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
    .refine((file) => file.size <= CREATE_COURSE_THUMBNAIL_MAX_SIZE, {
      message: `Image size must be less than ${CREATE_COURSE_THUMBNAIL_MAX_SIZE / (1024 * 1024)}MB`
    })
    .nullable()
    .optional(),
  courseLessons: z.array(createLessonSchema).refine((lessons) => lessons.length > 0, {
    message: "At least one lesson is required"
  }),

  coursePrice: z.number().optional(),
  courseSummary: z.string().min(1, { message: "Course summary is required" }).max(200, {
    message: "Course summary must be less than 200 characters"
  }),
  courseCertificate: z.number().min(1, { message: "Certificate template is required" }),
  courseMakeAvailable: z.boolean()
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;
export type CreateCourseSchemaWithId = CreateCourseSchema & {
  courseId: string;
};
