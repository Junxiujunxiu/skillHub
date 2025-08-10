import express from "express";
import {
  getCourse,
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";
import { requireAuth } from "@clerk/express";
import multer from "multer";

/* =========================================================================
   Router: Course Routes
   Purpose:
     - Defines all API endpoints for managing courses.
     - Connects HTTP requests to their respective controller functions.
   ========================================================================= */
const router = express.Router();

/* =========================================================================
   Middleware: Multer (Memory Storage)
   Purpose:
     - Handles file uploads before sending them to AWS S3 or other storage.
     - Uses memory storage so files are kept in memory until processed.
   Usage:
     - upload.single("image") → Expects a single file field named "image".
   ========================================================================= */
const upload = multer({ storage: multer.memoryStorage() });

/* =========================================================================
   Route: GET /
   Description:
     - Retrieve a list of all courses.
     - Supports optional category filtering via query parameter (?category=...).
   Access: Public
   Controller: listCourses
   Example: GET /courses
   ========================================================================= */
router.get("/", listCourses);

/* =========================================================================
   Route: POST /
   Description:
     - Create a new course.
     - Requires authentication.
   Access: Authenticated users only (requireAuth)
   Controller: createCourse
   Example: POST /courses
   ========================================================================= */
router.post("/", requireAuth(), createCourse);

/* =========================================================================
   Route: GET /:courseId
   Description:
     - Retrieve details of a single course by courseId.
   Access: Public
   Controller: getCourse
   Example: GET /courses/123
   ========================================================================= */
router.get("/:courseId", getCourse);

/* =========================================================================
   Route: PUT /:courseId
   Description:
     - Update details of an existing course.
     - Requires authentication and ownership (handled in controller).
     - Supports uploading a single image file ("image").
   Access: Authenticated users only (requireAuth)
   Middleware: upload.single("image") → File handling for image uploads.
   Controller: updateCourse
   Example: PUT /courses/123
   ========================================================================= */
router.put("/:courseId", requireAuth(), upload.single("image"), updateCourse);

/* =========================================================================
   Route: DELETE /:courseId
   Description:
     - Delete a course by its courseId.
     - Requires authentication and ownership (handled in controller).
   Access: Authenticated users only (requireAuth)
   Controller: deleteCourse
   Example: DELETE /courses/123
   ========================================================================= */
router.delete("/:courseId", requireAuth(), deleteCourse);

/* =========================================================================
   Export:
     - Exports the configured router to be used in the main app.
   ========================================================================= */
export default router;
