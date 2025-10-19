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
   Teacher Courses Page
   Purpose:
   - Display all teacher-owned courses.
   - Allow searching, filtering, creating, editing, and deleting.
   ========================================================= */
const Courses = () => {
  /* ---------- Routing & Auth ---------- */
  const router = useRouter();
  const { user, isLoaded } = useUser();

  /* ---------- Fetch Courses ---------- */
  const {
    data: courses,
    isLoading,
    isError,
  } = useGetCoursesQuery({ category: "all" }, { skip: !isLoaded });

  /* ---------- Mutations ---------- */
  const [createCourse] = useCreateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  /* ---------- Local State ---------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  /* ---------- Unique Categories ---------- */
  const uniqueCategories = useMemo(() => {
    if (!courses) return [];
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set).sort();
  }, [courses]);

  /* ---------- Filtered Courses ---------- */
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        course.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  /* ---------- Handlers ---------- */
  const handleEdit = (course: Course) =>
    router.push(`/teacher/courses/${course.courseId}`, { scroll: false });

  const handleDelete = async (course: Course) => {
    const confirmed = window.confirm("Are you sure you want to delete this course?");
    if (!confirmed) return;
    await deleteCourse(course.courseId).unwrap();
  };

  const handleCreateCourse = async () => {
    if (!user) return;
    try {
      const created = await createCourse({
        teacherId: user.id,
        teacherName: user.fullName || user.primaryEmailAddress?.emailAddress || "Unknown",
      }).unwrap();

      router.push(`/teacher/courses/${created.courseId}`, { scroll: false });
    } catch (e: any) {
      console.error("Create course failed:", e);
      alert(e?.data?.message ?? "Failed to create course");
    }
  };

  /* ---------- States ---------- */
  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Error loading courses.</div>;

  /* ---------- Render ---------- */
  return (
    <div className="teacher-courses px-6">
      <Header
        title="Courses"
        subtitle="Browse your courses"
        rightElement={
          <Button onClick={handleCreateCourse} className="teacher-courses__header">
            Create Course
          </Button>
        }
      />

      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        categories={uniqueCategories} // ✅ Fix build error — prop now passed
      />

      <div className="teacher-courses__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
