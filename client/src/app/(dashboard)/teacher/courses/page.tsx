"use client";

/* =========================
   Imports
   ========================= */
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TeacherCourseCard from "@/components/TeacherCOurseCard";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
} from "@/state/api";

/* =========================
   Page Component
   ========================= */
const Course = () => {
  /* ---------- Routing & Auth ---------- */
  const router = useRouter();
  const { user } = useUser();

  /* ---------- Server Data (RTK Query) ---------- */
  // Load all courses once the page mounts
  const {
    data: courses,
    isLoading,
    isError,
  } = useGetCoursesQuery({ category: "all" });

  /* ---------- Mutations (create / delete) ---------- */
  // We only need the trigger functions here
  const [createCourse] = useCreateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  /* ---------- Local UI State ---------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  /* ---------- Derived Data (Filtering) ---------- */
  // Memoized client-side filter for search + category
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLocaleLowerCase());

      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  /* ---------- Handlers (Edit / Delete / Create) ---------- */
  const handleEdit = (course: Course) => {
    router.push(`/teacher/courses/${course.courseId}`, { scroll: false });
  };

  const handleDelete = async (course: Course) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmed) return;

    await deleteCourse(course.courseId).unwrap();
    // Cache invalidation in the API slice will refresh the list automatically
  };

  const handleCreateCourse = async () => {
    if (!user) return;

    const result = await createCourse({
      teacherId: user.id,
      teacherName: user.fullName || "Unknown Teacher",
    }).unwrap();

    router.push(`/teacher/courses/${result.courseId}`, { scroll: false });
  };

  /* ---------- Loading / Error States ---------- */
  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Error loading courses.</div>;

  /* ---------- Render ---------- */
  return (
    <div className="teacher-courses">
      {/* Header with primary action */}
      <Header
        title="Courses"
        subtitle="Browse your courses"
        rightElement={
          <Button onClick={handleCreateCourse} className="teacher-courses__header">
            Create course
          </Button>
        }
      />

      {/* Search & Category Toolbar
          NOTE: Verify prop name: if your Toolbar expects `onCategoryChange`,
          update the prop below accordingly. */}
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryCHange={setSelectedCategory}
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

export default Course;
