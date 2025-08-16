import { Request, Response } from "express";
import Course from "../models/courseModel";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";
import AWS from "aws-sdk";

const s3 = new AWS.S3();

/* =========================================================================
   Controller: listCourses
   Purpose:
     - Retrieve a list of courses, optionally filtered by category.
   Flow:
     1. Check if a "category" query parameter is provided.
     2. If provided and not "all" → scan courses by category.
     3. If not provided or "all" → scan and return all courses.
     4. Send results back to client.
   ========================================================================= */
export const listCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category } = req.query;

  try {
    // Retrieve either filtered or all courses
    const courses =
      category && category !== "all"
        ? await Course.scan("category").eq(category).exec()
        : await Course.scan().exec();

    res.json({
      message: "Courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving courses", error });
  }
};

/* =========================================================================
   Controller: getCourse
   Purpose:
     - Retrieve details for a single course by courseId.
   Flow:
     1. Extract courseId from params.
     2. Try to get the course from DB.
     3. If not found → return 404.
     4. If found → return course data.
   ========================================================================= */
export const getCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;

  try {
    const course = await Course.get(courseId);

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.json({
      message: "Course retrieved successfully",
      data: course,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving course", error });
  }
};

/* =========================================================================
   Controller: createCourse
   Purpose:
     - Create a new course with default values.
   Flow:
     1. Extract teacherId and teacherName from request body.
     2. Validate both fields (required).
     3. Generate a unique courseId.
     4. Create a new course record with default placeholders.
     5. Save to DB and return the created course.
   ========================================================================= */
export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teacherId, teacherName } = req.body;

    // Validate required fields
    if (!teacherId || !teacherName) {
      res
        .status(400)
        .json({ message: "Teacher Id and name are required" });
      return;
    }
    

    // Create new course with default values
    const newCourse = new Course({
      courseId: uuidv4(),
      teacherId,
      teacherName,
      title: "Untitled Course",
      description: "",
      category: "Uncategorized",
      image: "",
      price: 0,
      level: "Beginner",
      status: "Draft",
      sections: [],
      enrollments: [],
    });

    await newCourse.save();

    res.json({
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error });
  }
};

/* =========================================================================
   Controller: updateCourse
   Purpose:
     - Update course details.
     - Only the course's teacher can update.
   Flow:
     1. Extract courseId from params and request body data.
     2. Get the current logged-in user's ID via Clerk.
     3. Retrieve the course from DB.
     4. If not found → return 404.
     5. If logged-in user is not the course teacher → return 403.
     6. Validate & update price (convert to cents if provided).
     7. If sections are updated:
        - Parse JSON if necessary.
        - Ensure section and chapter IDs exist (generate if missing).
     8. Merge update data into existing course and save.
   ========================================================================= */
export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;
  const updateData = { ...req.body };
  const { userId } = getAuth(req);

  try {
    const course = await Course.get(courseId);

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Only teacher can update course
    if (course.teacherId !== userId) {
      res
        .status(403)
        .json({ message: "Not authorized to update this course" });
      return;
    }

    // Handle price update
    if (updateData.price) {
      const price = parseInt(updateData.price);
      if (isNaN(price)) {
        res.status(400).json({
          message: "Invalid price format",
          error: "Price must be a valid number",
        });
        return;
      }
      updateData.price = price * 100; // Store in cents
    }

    // Handle sections update
    if (updateData.sections) {
      const sectionsData =
        typeof updateData.sections === "string"
          ? JSON.parse(updateData.sections)
          : updateData.sections;

      updateData.sections = sectionsData.map((section: any) => ({
        ...section,
        sectionId: section.sectionId || uuidv4(),
        chapters: section.chapters.map((chapter: any) => ({
          ...chapter,
          chapterId: chapter.chapterId || uuidv4(),
        })),
      }));
    }

    // Merge and save
    Object.assign(course, updateData);
    await course.save();

    res.json({
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
};

/* =========================================================================
   Controller: deleteCourse
   Purpose:
     - Delete a course by courseId.
     - Only the course's teacher can delete it.
   Flow:
     1. Extract courseId from params.
     2. Get the current logged-in user's ID via Clerk.
     3. Retrieve the course from DB.
     4. If not found → return 404.
     5. If logged-in user is not the course teacher → return 403.
     6. Delete the course from DB.
     7. Return deleted course data.
   ========================================================================= */
export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;
  const { userId } = getAuth(req);

  try {
    const course = await Course.get(courseId);

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Only teacher can delete course
    if (course.teacherId !== userId) {
      res
        .status(403)
        .json({ message: "Not authorized to delete this course" });
      return;
    }

    await Course.delete(courseId);

    res.json({
      message: "Course deleted successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};

/* =========================================================================
   Controller: getUploadVideoUrl
   Purpose:
     - Generate a pre-signed S3 URL for secure video uploads.
     - Return both the signed upload URL (for client upload) and the public video URL (via CloudFront).

   Flow:
     1. Extract `fileName` and `fileType` from request body.
     2. Validate that both fields are provided; return 400 if missing.
     3. Generate a unique ID to prevent filename conflicts.
     4. Construct the S3 key path using the unique ID and file name.
     5. Prepare S3 parameters for the signed URL (bucket, key, expiry, and content type).
     6. Generate a signed URL for uploading directly to S3.
     7. Build the public video URL using the CloudFront domain.
     8. Respond with both URLs so the client can upload and later access the video.
     9. Handle any errors with a 500 status and descriptive message.
   ========================================================================= */
export const getUploadVideoUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    res.status(400).json({ message: "File name and type are required" });
    return;
  }

  try {
    const uniqueId = uuidv4();
    const s3Key = `videos/${uniqueId}/${fileName}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: s3Key,
      Expires: 60,
      ContentType: fileType,
    };

    const uploadUrl = s3.getSignedUrl("putObject", s3Params);
    const videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${fileName}`;

    res.json({
      message: "Upload URL generated successfully",
      data: { uploadUrl, videoUrl },
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating upload URL", error });
  }
};
