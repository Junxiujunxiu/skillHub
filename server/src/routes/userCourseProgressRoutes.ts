import express from "express";
import {
  getUserCourseProgress,
  getUserEnrolledCourses,
  updateUserCourseProgress,
} from "../controllers/userCourseProgressController";

/* =========================================================================
   Router: userCourseProgressRoutes
   Purpose:
     - Define API endpoints related to user course progress and enrollments.
   Flow:
     1. Create an Express Router instance.
     2. Map HTTP methods & routes to controller functions.
     3. Export the configured router for use in the main server file.
   ========================================================================= */
const router = express.Router();

/* -------------------------------------------------------------------------
   Route: GET /:userId/enrolled-courses
   Purpose:
     - Retrieve all courses in which a specific user is enrolled.
   Controller:
     - getUserEnrolledCourses
   ------------------------------------------------------------------------- */
router.get("/:userId/enrolled-courses", getUserEnrolledCourses);

/* -------------------------------------------------------------------------
   Route: GET /:userId/courses/:courseId
   Purpose:
     - Retrieve the progress details of a specific user in a specific course.
   Controller:
     - getUserCourseProgress
   ------------------------------------------------------------------------- */
router.get("/:userId/courses/:courseId", getUserCourseProgress);

/* -------------------------------------------------------------------------
   Route: PUT /:userId/courses/:courseId
   Purpose:
     - Update a user's course progress for a specific course.
   Controller:
     - updateUserCourseProgress
   ------------------------------------------------------------------------- */
router.put("/:userId/courses/:courseId", updateUserCourseProgress);

/* -------------------------------------------------------------------------
   Export:
     - Export the router to be used in the main server application.
   ------------------------------------------------------------------------- */
export default router;
