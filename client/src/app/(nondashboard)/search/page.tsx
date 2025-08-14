"use client";

/* =========================================================
   Page: Search
   Purpose:
     - Displays a list of available courses and lets the user
       select one to preview details and proceed to checkout.
   Layout:
     - Left: Course grid
     - Right: Selected course details (when a course is selected)
   Tech:
     - RTK Query (`useGetCoursesQuery`) to fetch courses
     - Next.js router for client-side navigation
     - Framer Motion for subtle entrance animations
   Notes:
     - Reads `id` from the URL’s query to preselect a course.
     - Falls back to the first course if no id is provided.
   ========================================================= */

import Loading from "@/components/Loading"; // Loading spinner
import { useGetCoursesQuery } from "@/state/api"; // RTK Query: fetch courses
import { useRouter } from "next/navigation"; // Client-side navigation
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CourseCardSearch from "@/components/CourseCardSearch"; // Course card UI
import SelectedCourse from "./SelectedCourse"; // Selected course details

/* =========================================================
   Component: Search
   ========================================================= */
const Search = () => {
  /* ---------- URL Params ---------- */
  // Create a query param reader (simple approach)
  const searchParams = new URLSearchParams();
  const id = searchParams.get("id");

  /* ---------- Data Fetch ---------- */
  // Fetch all courses (adjust args if API expects filters)
  const {
    data: courses,
    isLoading,
    isError,
  } = useGetCoursesQuery({});

  /* ---------- Local State ---------- */
  // Track the currently selected course
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  /* ---------- Router ---------- */
  const router = useRouter();

  /* ---------- Handle Preselection via URL Param ---------- */
  // If an id is provided, select that course; otherwise select the first one.
  useEffect(() => {
    if (courses) {
      if (id) {
        const course = courses.find((c) => c.courseId === id);
        setSelectedCourse(course || courses[0]);
      } else {
        setSelectedCourse(courses[0]);
      }
    }
  }, [courses, id]);

  /* ---------- Loading / Error States ---------- */
  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Failed to fetch courses</div>;

  /* ---------- Handlers ---------- */
  // Select a course and update URL for deep-linking
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    router.push(`/search?id=${course.courseId}`);
  };

  // Navigate to checkout with the selected course
  const handleEnrollNow = (courseId: string) => {
    router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`); 
  };

  /* ---------- Render ---------- */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      // className="search"
    >
      {/* Page title & count */}
      <h1 className="search__title">List of availabile courses</h1>
      <h2 className="search__subtitle">{courses.length} courses available</h2>

      <div className="search__content">
        {/* Course Grid */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="search__courses-grid"
        >
          {courses.map((course) => (
            <CourseCardSearch
              key={course.courseId}
              course={course}
              isSelected={selectedCourse?.courseId === course.courseId}
              onClick={() => handleCourseSelect(course)}
            />
          ))}
        </motion.div>

        {/* Selected Course Panel */}
        {selectedCourse && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="search__selected-course"
          >
            <SelectedCourse
              course={selectedCourse}
              handleEnrollNow={handleEnrollNow}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Search;
