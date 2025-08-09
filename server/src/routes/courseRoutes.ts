import express from "express";
import { getCourse, listCourses, createCourse, updateCourse, deleteCourse } from "../controllers/courseController";
import { requireAuth } from "@clerk/express";
import multer from "multer";

//router for courses that set up trigger and once the url is visited, run the function.
//like a person controlling the traffic
const router = express.Router();
//saves the video before uploading to aws s3.
const upload = multer({ storage: multer.memoryStorage() })

//“When the URL ends with / (like just /course), run listCourses().”
router.get("/", listCourses);
router.post("/", requireAuth(), createCourse);
//When the URL ends with /123 (like /course/123), run getCourse().”
router.get("/:courseId", getCourse);
router.put("/:courseId", requireAuth(), upload.single("image"), updateCourse);
router.delete("/:courseId", requireAuth(), deleteCourse);

export default router;