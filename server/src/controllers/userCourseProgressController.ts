import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import UserCourseProgress from "../models/userCourseProgressModel";
import Course from "../models/courseModel";
import { calculateOverallProgress } from "../utils/utils";
import { mergeSections } from "../utils/utils";

/* =========================================================================
   Controller: getUserEnrolledCourses
   Purpose:
     - Retrieves all courses a given user is enrolled in.
     - Ensures the request is made by the same authenticated user.
   Flow:
     1. Extract userId from request params.
     2. Authenticate using Clerk to make sure the user matches.
     3. Query UserCourseProgress table for all enrollments by this user.
     4. Get the actual Course objects for each enrollment.
     5. Return the list of enrolled courses as JSON.
   ========================================================================= */
export const getUserEnrolledCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params; // The target user ID from the URL
  const auth = getAuth(req); // Get auth info from Clerk

  // Security check: prevent users from accessing another user's data
  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
    // Step 1: Query UserCourseProgress table for all courses this user is in
    const enrolledCourses = await UserCourseProgress.query("userId")
      .eq(userId)
      .exec();

    // Step 2: Extract all course IDs
    const courseIds = enrolledCourses.map((item: any) => item.courseId);

    // Step 3: Retrieve the actual Course objects in bulk
    const courses = await Course.batchGet(courseIds);

    // Step 4: Send success response
    res.json({
      message: "Enrolled courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    // Error handling
    res
      .status(500)
      .json({ message: "Error retrieving enrolled courses", error });
  }
};

/* =========================================================================
   Controller: getUserCourseProgress
   Purpose:
     - Fetch progress details for a specific course and user.
   Flow:
     1. Extract userId and courseId from the request parameters.
     2. Look up the progress record in UserCourseProgress table.
     3. If not found, return 404.
     4. If found, return progress data.
   ========================================================================= */
export const getUserCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;

  try {
    // Look up progress by composite key (userId + courseId)
    const progress = await UserCourseProgress.get({ userId, courseId });

    // If no progress exists, send 404
    if (!progress) {
      res
        .status(404)
        .json({ message: "Course progress not found for this user" });
      return;
    }

    // Return the progress record
    res.json({
      message: "Course progress retrieved successfully",
      data: progress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user course progress", error });
  }
};

/* =========================================================================
   Controller: updateUserCourseProgress
   Purpose:
     - Update or create a progress record for a given user & course.
     - Tracks overall progress, section progress, and last accessed time.
   Flow:
     1. Extract userId, courseId from params & progress data from body.
     2. Check if progress record already exists in DB.
     3. If no record exists → create a new progress entry with initial values.
     4. If record exists → merge new section progress into existing data.
     5. Recalculate overall progress using helper function.
     6. Save updated record back to DB.
     7. Return updated progress.
   ========================================================================= */
export const updateUserCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;
  const progressData = req.body; // Expected to contain updated section progress

  try {
    // Step 1: Try to get existing progress record
    let progress = await UserCourseProgress.get({ userId, courseId });

    if (!progress) {
      // CASE: First time progress record is being created for this user/course
      progress = new UserCourseProgress({
        userId,
        courseId,
        enrollmentDate: new Date().toISOString(), // Track when they enrolled
        overallProgress: 0, // Initially 0%
        sections: progressData.sections || [], // Sections user has worked on
        lastAccessedTimestamp: new Date().toISOString(), // Timestamp for last activity
      });
    } else {
      // CASE: Updating existing progress
      // Merge old sections with new progress updates
      progress.sections = mergeSections(
        progress.sections,
        progressData.sections || []
      );

      // Update last activity timestamp
      progress.lastAccessedTimestamp = new Date().toISOString();

      // Recalculate the overall course completion %
      progress.overallProgress = calculateOverallProgress(progress.sections);
    }

    // Step 2: Save to database
    await progress.save();

    // Step 3: Send back updated progress
    res.json({
      message: "User course progress updated successfully",
      data: progress,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({
      message: "Error updating user course progress",
      error,
    });
  }
};
