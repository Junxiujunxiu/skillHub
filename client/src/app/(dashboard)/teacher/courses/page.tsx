"use client";

/* =========================================================
   Imports
   ========================================================= */
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TeacherCourseCard from "@/components/TeacherCourseCard";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
} from "@/state/api";

/* =========================================================
   Course Page Component
   Purpose:
   - Display all teacher-owned courses
   - Allow searching, filtering, creating, editing, and deleting courses
   - Integrates with RTK Query for server state and Clerk for authentication

   Key Features:
   - Client-side filtering by search term & category
   - Uses RTK Query for data fetching and mutations
   - Navigates to course editor on create/edit
   - Deletes with confirmation dialog
   ========================================================= */
const Courses = () => {
  /* ---------- Routing & Authentication ---------- */
  const router = useRouter();
  const { user, isLoaded } = useUser();//UPDATED VERSION

  /* ---------- Fetch Courses (RTK Query) ---------- */
  const {
    data: courses,
    isLoading,
    isError,
  } = useGetCoursesQuery({ category: "all" }, { skip: !isLoaded }); //UPDATED VERSION

  /* ---------- Mutations (Create & Delete) ---------- */
  const [createCourse] = useCreateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  /* ---------- Local State ---------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  /* ---------- Derived State (Filtered Courses) ---------- */
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  /* ---------- Handlers ---------- */
  const handleEdit = (course: Course) => {
    router.push(`/teacher/courses/${course.courseId}`, { scroll: false });
  };

  const handleDelete = async (course: Course) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmed) return;

    await deleteCourse(course.courseId).unwrap();
    // RTK Query will refetch courses after mutation
  };
//--------------------------NEW VERSION--------------------------
  const handleCreateCourse = async () => {
    if (!user) return;
  
    try {
      const created = await createCourse({
        teacherId: user.id,
        teacherName:
          user.fullName ||
          user.primaryEmailAddress?.emailAddress ||
          "Unknown",
      }).unwrap();
  
      router.push(`/teacher/courses/${created.courseId}`, { scroll: false });
    } catch (e: any) {
      console.error("Create course failed:", e);
      alert(e?.data?.message ?? "Failed to create course");
    }
  };
  

  /* ---------- Loading / Error States ---------- */
  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Error loading courses.</div>;

  /* ---------- Render ---------- */
  return (
    <div className="teacher-courses">
      {/* Page Header */}
      <Header
        title="Courses"
        subtitle="Browse your courses"
        rightElement={
          <Button
            onClick={handleCreateCourse}
            className="teacher-courses__header"
          >
            Create course
          </Button>
        }
      />

      {/* Toolbar for Search & Category Filtering */}
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory} // Ensure prop name matches Toolbar's definition
      />

      {/* Courses Grid */}
      <div className="teacher-courses__grid">
        {filteredCourses.map((course) => (
          <TeacherCourseCard
            key={course.courseId}
            course={course}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isOwner={course.teacherId === user?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;
