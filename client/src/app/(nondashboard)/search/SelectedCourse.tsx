/* =========================================================
   Component: SelectedCourse
   Purpose:
     - Displays detailed information about a specific course.
     - Allows the user to enroll via the provided `handleEnrollNow` function.
   Props:
     - course: The course object containing details, sections, and enrollments.
     - handleEnrollNow: Callback triggered when the user clicks "Enroll now".
   Layout:
     - Title and author info (with enrollment count)
     - Course description
     - Course content (Accordion view of sections)
     - Footer with price and enrollment button
   ========================================================= */

   import AccordionSections from "@/components/AccordionSections"; // Accordion for course sections
   import { Button } from "@/components/ui/button"; // Styled button component
   import { formatPrice } from "@/lib/utils"; // Utility to format price into currency
   import React from "react";
   
   /* =========================================================
      Functional Component
      ========================================================= */
   const SelectedCourse = ({
     course,
     handleEnrollNow,
   }: SelectedCourseProps) => {
     return (
       <div className="selected-course">
         {/* ---------- Header ---------- */}
         <div>
           {/* Course Title */}
           <h3 className="selected-course__title">{course.title}</h3>
   
           {/* Author & Enrollment Count */}
           <p className="selected-course__author">
             By {course.teacherName} |{" "}
             <span className="selected-course__enrollment-count">
               {course?.enrollments?.length}
             </span>
           </p>
         </div>
   
         {/* ---------- Main Content ---------- */}
         <div className="selected-course__content">
           {/* Course Description */}
           <p className="selected-course__description">{course.description}</p>
   
           {/* Sections (Accordion) */}
           <div className="selected-course__sections">
             <h4 className="selected-course__sections-title">Course Content</h4>
             <AccordionSections sections={course.sections} />
           </div>
   
           {/* ---------- Footer ---------- */}
           <div className="selected-course__footer">
             {/* Price */}
             <span className="selected-course__price">
               {formatPrice(course.price)}
             </span>
   
             {/* Enroll Button */}
             <Button
               onClick={() => handleEnrollNow(course.courseId)}
               className="bg-primary-700 hover:bg-primary-600"
             >
               Enroll now
             </Button>
           </div>
         </div>
       </div>
     );
   };
   
   export default SelectedCourse;
   