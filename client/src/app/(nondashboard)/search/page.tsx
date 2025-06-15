
"use client";

import Loading from '@/components/Loading'; //Custom component to show a loading spinner.
import { useGetCoursesQuery } from '@/state/api'; // Hook to fetch courses from Redux Toolkit Query
import { useRouter } from 'next/navigation';//Used to change the URL
import React, { use, useEffect, useState } from 'react'
import { motion } from "framer-motion"
import CourseCardSearch from '@/components/CourseCardSearch';//UI component to show each course
import SelectedCourse from './SelectedCourse';//UI component to show the selected course in detail.

  // This is the search page where we will handle the search functionality
const Search = () => {
const searchParams = new URLSearchParams(); // We will use the URLSearchParams to get the search query from the URL
const id = searchParams.get('id');
const {data: courses, isLoading, isError} = useGetCoursesQuery({});//custom hook to fetch courses from the API using Redux Toolkit Query--get the list of course, tell if loading, tell if an error
const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);// State to hold the selected course, initially null
const router = useRouter();// Next.js router to handle navigation

/*useEffect to set the selected course based on the URL parameter or fallback to the first course
 This effect runs when the courses data changes or when the id parameter changes
 It checks if the courses are loaded and if an id is provided, then finds the course with that id
If no course is found, it defaults to the first course in the list*/
useEffect(() => {
  if (courses) {
    if (id) {
      const course = courses.find((c) => c.courseId === id);
            setSelectedCourse(course || courses[0]); // Set the selected course or fallback to the first course
        } else {
            setSelectedCourse(courses[0]); // Fallback to the first course if no match
        }   
    }
}, [courses, id]);    

/*
If the courses are still loading, show a loading spinner
If there is an error or no courses are fetched, show an error message*/

if (isLoading) return <Loading />;
if( isError || !courses) return <div>Failed to fetch courses</div> 

// Function to handle course selection, sets the selected course and navigates to the search page with the course id
// This function is called when a course card is clicked
// It updates the selected course state and navigates to the search page with the course id
// This allows the user to see the details of the selected course
// The course id is passed as a query parameter in the URL
// This is useful for deep linking to a specific course from other parts of the application
// The router.push method is used to change the URL without reloading the page
// This is a client-side navigation, so it does not cause a full page reload
// This is important for a smooth user experience in a single-page application (SPA) like Next.js
// The selected course is also stored in the state so that it can be displayed in the SelectedCourse component
// This allows the user to see the details of the selected course without having to fetch it again
const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    router.push(`/search?id=${course.courseId}`);
    };

// Function to handle the "Enroll Now" button click
// This function is called when the user clicks the "Enroll Now" button in the SelectedCourse component
// It navigates the user to the checkout page with the course id and a flag to show the signup form 
// The course id is passed as a query parameter in the URL
// This allows the user to proceed to the checkout process for the selected course
// The router.push method is used to change the URL without reloading the page
// This is a client-side navigation, so it does not cause a full page reload
// This is important for a smooth user experience in a single-page application (SPA) like Next.js
const handleEnrollNow = (courseId: string) => {
    router.push(`/checkout?step=1&id=${courseId}&showSignup=false`);
}

// The main return statement of the Search component
// It uses Framer Motion for animations and transitions
// It displays the list of available courses and the selected course details
// The courses are displayed in a grid layout using the CourseCardSearch component
//  The selected course is displayed in the SelectedCourse component
// The selected course is shown only when a course is selected
// The SelectedCourse component shows the course details and the "Enroll Now" button
// The "Enroll Now" button allows the user to proceed to the checkout process for the selected course
// The courses are fetched from the API using the useGetCoursesQuery hook
// The courses are displayed in a grid layout using the CourseCardSearch component
// The CourseCardSearch component shows the course title, description, and an image
// The CourseCardSearch component also handles the click event to select a course
// The selected course is shown in the SelectedCourse component
// The SelectedCourse component shows the course details and the "Enroll Now" button
// The "Enroll Now" button allows the user to proceed to the checkout process for the selected course
// The SelectedCourse component also handles the click event to enroll in the course
// The handleEnrollNow function is called when the "Enroll Now" button is clicked
// It navigates the user to the checkout page with the course id and a flag to show the signup form
// The course id is passed as a query parameter in the URL
// This allows the user to proceed to the checkout process for the selected course
// The router.push method is used to change the URL without reloading the page
// This is a client-side navigation, so it does not cause a full page reloadl;.
  return  <motion.div 
  initial={{ opacity: 0}}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
//   className="search"
  >
    <h1 className="search__title">List of availabile courses</h1>
    <h2 className="search__subtitle">{courses.length} courses available</h2>
    <div className='search__content'>
    <motion.div
        initial={{ y:40, opacity: 0 }}
        animate={{y:0, opacity: 1}}
        transition={{ duration: 0.5, delay: 0.2}}
        className="search__courses-grid"
        >
    {courses.map((course) => (
        <CourseCardSearch
        key={course.courseId}
        course={course} 
        isSelected={selectedCourse?.courseId === course.courseId}
        onClick={()=>handleCourseSelect(course)}
        />
    ))}
     </motion.div>  
     {selectedCourse && (
         <motion.div
         initial={{ y:40, opacity: 0 }}
         animate={{y:0, opacity: 1}}
         transition={{ duration: 0.5, delay: 0.5}}
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
  
}
export default Search