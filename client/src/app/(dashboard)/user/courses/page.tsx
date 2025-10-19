"use client";

import Toolbar from "@/components/Toolbar";
import CourseCard from "@/components/CourseCard";
import { useGetUserEnrolledCoursesQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useUser } from "@clerk/nextjs";
import { useState, useMemo } from "react";
import Loading from "@/components/Loading";

const Courses = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch enrolled courses for the current user
  const {
    data: courses,
    isLoading,
    isError,
  } = useGetUserEnrolledCoursesQuery(user?.id ?? "", {
    skip: !isLoaded || !user,
  });

  // Extract unique category list dynamically from enrolled courses
  const uniqueCategories = useMemo(() => {
    if (!courses) return [];
    const set = new Set<string>();
    courses.forEach((c) => c.category && set.add(c.category));
    return Array.from(set).sort();
  }, [courses]);

  // Debug logs
  console.log("Fetched courses →", courses);
  console.log("Selected Category →", selectedCategory);

  // Filter courses by category and search keyword
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

  // Navigate to first available chapter (or course page if empty)
  const handleGoToCourse = (course: Course) => {
    if (course.sections?.[0]?.chapters?.length) {
      const firstChapter = course.sections[0].chapters[0];
      router.push(
        `/user/courses/${course.courseId}/chapters/${firstChapter.chapterId}`,
        { scroll: false }
      );
    } else {
      router.push(`/user/courses/${course.courseId}`, { scroll: false });
    }
  };

  // Loading & edge states
  if (!isLoaded || isLoading) return <Loading />;
  if (!user) return <div>Please sign in to view your courses.</div>;
  if (isError || !courses?.length)
    return <div>You are not enrolled in any courses yet.</div>;

  return (
    <div className="user-courses px-6">
      <Header title="My Courses" subtitle="View your enrolled courses" />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        categories={uniqueCategories} // dynamic category list
      />
      <div className="user-courses__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.courseId}
            course={course}
            onGoToCourse={handleGoToCourse}
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;
