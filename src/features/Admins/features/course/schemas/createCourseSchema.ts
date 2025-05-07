import { z } from "zod";
import { CREATE_COURSE_THUMBNAIL_MAX_SIZE } from "@/constants";
import { createLessonSchema } from "./createLessonSchema";

export const createCertificateSchema = z.object({
  template: z.string().nonempty({ message: "Template is required" })
});

export const createCourseSchema = z.object({
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
  courseLevel: z.enum(["Beginner", "Intermediate", "Advance"]),
  courseThumbnail: z
    .string()
    .nullable()
    .refine(
      (value) => {
        if (value) {
          // Check if the base64 string is a valid image
          const base64Pattern = /^data:image\/(png|jpeg|jpg|gif);base64,/;
          if (!base64Pattern.test(value)) {
            return false; // Invalid base64 format
          }

          // Check if the Base64 size is within the max allowed size
          const base64Data = value.split(",")[1]; // Get the base64 data (without prefix)
          const sizeInBytes = (base64Data.length * 3) / 4; // Convert from base64 length to byte size

          if (sizeInBytes > CREATE_COURSE_THUMBNAIL_MAX_SIZE) {
            return false; // Image size exceeds the max allowed size
          }
        }
        return true; // Allow null/undefined value
      },
      {
        message: `Image size must be less than ${CREATE_COURSE_THUMBNAIL_MAX_SIZE / (1024 * 1024)}MB`
      }
    )
    .optional(),
  courseLessons: z.array(createLessonSchema).refine((lessons) => lessons.length > 0, {
    message: "At least one lesson is required"
  }),

  coursePrice: z.number().optional(),
  courseSummary: z.string().min(1, { message: "Course summary is required" }).max(200, {
    message: "Course summary must be less than 200 characters"
  }),
  courseCertificate: createCertificateSchema.refine((certificate) => certificate.template !== "", {
    message: "Course certificate is required"
  }),
  courseMakeAvailable: z.boolean()
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;
export type CreateCertificateSchema = z.infer<typeof createCertificateSchema>;
