import { Schema, model } from "dynamoose";

/* =========================================================================
   Sub-Schema: chapterProgressSchema
   Purpose:
     - Tracks completion status of a single chapter for a user.
   Fields:
     - chapterId (string, required) → Unique identifier of the chapter.
     - completed (boolean, required) → Whether the chapter has been completed.
   ========================================================================= */
const chapterProgressSchema = new Schema({
  chapterId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
});

/* =========================================================================
   Sub-Schema: sectionProgressSchema
   Purpose:
     - Tracks progress of a section within a course.
     - Contains multiple chapter progress records.
   Fields:
     - sectionId (string, required) → Unique identifier of the section.
     - chapters (array) → List of chapters in this section, each with progress info.
   ========================================================================= */
const sectionProgressSchema = new Schema({
  sectionId: {
    type: String,
    required: true,
  },
  chapters: {
    type: Array,
    schema: [chapterProgressSchema], // Array of chapter progress objects
  },
});

/* =========================================================================
   Main Schema: userCourseProgressSchema
   Purpose:
     - Tracks a user's progress for a specific course.
   Keys:
     - hashKey: userId → Groups all progress records by user.
     - rangeKey: courseId → Distinguishes progress per course for the same user.
   Fields:
     - userId (string, required) → ID of the user.
     - courseId (string, required) → ID of the course.
     - enrollmentDate (string, required) → Date when user enrolled (ISO format).
     - overallProgress (number, required) → Percentage completion of the course.
     - sections (array) → List of sections and their chapter progress.
     - lastAccessedTimestamp (string, required) → Last time the course was accessed.
   Options:
     - timestamps: true → Automatically adds createdAt and updatedAt fields.
   ========================================================================= */
const userCourseProgressSchema = new Schema(
  {
    userId: {
      type: String,
      hashKey: true, // Partition key for user progress
      required: true,
    },
    courseId: {
      type: String,
      rangeKey: true, // Sort key to track per-course progress for the user
      required: true,
    },
    enrollmentDate: {
      type: String,
      required: true,
    },
    overallProgress: {
      type: Number,
      required: true,
    },
    sections: {
      type: Array,
      schema: [sectionProgressSchema],
    },
    lastAccessedTimestamp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================================
   Model: UserCourseProgress
   Purpose:
     - Dynamoose model for interacting with the "UserCourseProgress" table.
     - Allows CRUD operations to track and update user course progress.
   ========================================================================= */
const UserCourseProgress = model(
  "UserCourseProgress",
  userCourseProgressSchema
);

export default UserCourseProgress;
