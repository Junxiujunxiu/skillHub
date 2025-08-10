import * as z from "zod";

/* ================================
   Course & Learning Platform Schemas
   -------------------------------
   PURPOSE:
   - Centralised Zod validation schemas for all forms in the course platform.
   - Ensures consistent validation logic across course editor, chapters, sections,
     guest checkout, and notification settings.

   BENEFITS:
   1. Strong type inference with `z.infer`.
   2. Centralised form validation rules.
   3. Reusable in both frontend and backend.

   ================================
   1. Course Editor Schema
   -------------------------------
   Validates main course details for the course creation/edit form.
   ================================ */
export const courseSchema = z.object({
  courseTitle: z.string().min(1, "Title is required"),
  courseDescription: z.string().min(1, "Description is required"),
  courseCategory: z.string().min(1, "Category is required"),
  coursePrice: z.string(),
  courseStatus: z.boolean(),
});
export type CourseFormData = z.infer<typeof courseSchema>;

/* ================================
   2. Chapter Schema
   -------------------------------
   Validates chapter details in a course section.
   ================================ */
export const chapterSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  video: z.union([z.string(), z.instanceof(File)]).optional(),
});
export type ChapterFormData = z.infer<typeof chapterSchema>;

/* ================================
   3. Section Schema
   -------------------------------
   Validates section details that group multiple chapters.
   ================================ */
export const sectionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});
export type SectionFormData = z.infer<typeof sectionSchema>;

/* ================================
   4. Guest Checkout Schema
   -------------------------------
   Validates guest user email during checkout.
   ================================ */
export const guestSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export type GuestFormData = z.infer<typeof guestSchema>;

/* ================================
   5. Notification Settings Schema
   -------------------------------
   Validates user notification preferences.
   ================================ */
export const notificationSettingsSchema = z.object({
  courseNotifications: z.boolean(),
  emailAlerts: z.boolean(),
  smsAlerts: z.boolean(),
  notificationFrequency: z.enum(["immediate", "daily", "weekly"]),
});
export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;
