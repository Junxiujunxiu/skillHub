import { Schema, model } from "dynamoose";

/* =========================================================================
   Sub-Schema: commentSchema
   Purpose:
     - Represents a single comment left by a user on a chapter.
   Fields:
     - commentId (string, required) → Unique identifier for the comment.
     - userId (string, required) → ID of the user who wrote the comment.
     - text (string, required) → The comment's content.
     - timestamp (string, required) → When the comment was posted (ISO format).
   ========================================================================= */
const commentSchema = new Schema({
  commentId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

/* =========================================================================
   Sub-Schema: chapterSchema
   Purpose:
     - Represents an individual chapter inside a section.
   Fields:
     - chapterId (string, required) → Unique identifier for the chapter.
     - type (enum, required) → Type of chapter content (Text, Quiz, or Video).
     - title (string, required) → Chapter title.
     - content (string, required) → Main content or body text.
     - comments (array) → List of comments for the chapter.
     - video (string, optional) → Video URL (used if type is "Video").
   ========================================================================= */
const chapterSchema = new Schema({
  chapterId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Text", "Quiz", "Video"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    schema: [commentSchema], // Array of commentSchema objects
  },
  video: {
    type: String, // Optional, only used for video chapters
  },
});

/* =========================================================================
   Sub-Schema: sectionSchema
   Purpose:
     - Represents a section inside a course, which contains multiple chapters.
   Fields:
     - sectionId (string, required) → Unique identifier for the section.
     - sectionTitle (string, required) → Title of the section.
     - sectionDescription (string, optional) → Summary/description of the section.
     - chapters (array) → List of chapters within the section.
   ========================================================================= */
const sectionSchema = new Schema({
  sectionId: {
    type: String,
    required: true,
  },
  sectionTitle: {
    type: String,
    required: true,
  },
  sectionDescription: {
    type: String,
  },
  chapters: {
    type: Array,
    schema: [chapterSchema], // Array of chapterSchema objects
  },
});

/* =========================================================================
   Main Schema: courseSchema
   Purpose:
     - Represents a complete course entity stored in DynamoDB.
   Fields:
     - courseId (string, hashKey, required) → Unique identifier for the course.
     - teacherId (string, required) → ID of the teacher/creator.
     - teacherName (string, required) → Name of the teacher.
     - title (string, required) → Title of the course.
     - description (string, optional) → Description of the course.
     - category (string, required) → Category (e.g., "Programming", "Design").
     - image (string, optional) → URL to the course image.
     - price (number, optional) → Price in cents (avoid floating-point issues).
     - level (enum, required) → Difficulty level: Beginner, Intermediate, Advanced.
     - status (enum, required) → Publishing status: Draft or Published.
     - sections (array) → List of sections (each containing chapters).
     - enrollments (array) → List of enrolled users by userId.
   Options:
     - timestamps: true → Automatically adds createdAt and updatedAt fields.
   ========================================================================= */
const courseSchema = new Schema(
  {
    courseId: {
      type: String,
      hashKey: true,
      required: true,
    },
    teacherId: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Published"],
    },
    sections: {
      type: Array,
      schema: [sectionSchema],
    },
    enrollments: {
      type: Array,
      schema: [
        new Schema({
          userId: {
            type: String,
            required: true,
          },
        }),
      ],
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================================
   Model: Course
   Purpose:
     - Represents the Dynamoose model for interacting with the "Course" table.
     - Allows create, read, update, and delete operations on courses.
   ========================================================================= */
const Course = model("Course", courseSchema);

export default Course;
