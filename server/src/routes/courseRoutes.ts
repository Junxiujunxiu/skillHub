import express from "express";
import { getCourse, listCourses } from "../controllers/courseController";

//router for courses that set up trigger and once the url is visited, run the function.
const router = express.Router();

//“When the URL ends with / (like just /course), run listCourses().”
router.get("/", listCourses);
//When the URL ends with /123 (like /course/123), run getCourse().”
router.get("/:courseID", getCourse);

export default router;