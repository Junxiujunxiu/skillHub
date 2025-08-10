"use client";

import { CustomFormField } from "@/components/CustomFormField";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { courseSchema } from "@/lib/schemas";
import {
  centsToDollars,
  createCourseFormData,
  uploadAllVideos,
} from "@/lib/utils";
import { openSectionModal, setSections } from "@/state";
import {
  useGetCourseQuery,
  useUpdateCourseMutation,
  useGetUploadVideoUrlMutation,
} from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import DroppableComponent from "./Droppable";
import ChapterModal from "./ChapterModal";
import SectionModal from "./SectionModal";

/* =========================================================
   CourseEditor Component
   - Full-page form for editing a course
   - Loads course data from API
   - Allows editing course details (title, description, category, price, status)
   - Manages sections & chapters with drag-and-drop
   - Supports video uploads for chapters
   ========================================================= */
const CourseEditor = () => {
  /* ---------- Router & Params ---------- */
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // Course ID from URL

  /* ---------- API Queries & Mutations ---------- */
  const { data: course, isLoading, refetch } = useGetCourseQuery(id);
  const [updateCourse] = useUpdateCourseMutation();
  const [getUploadVideoUrl] = useGetUploadVideoUrlMutation();

  /* ---------- Redux State ---------- */
  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);

  /* ---------- Form Setup ---------- */
  const methods = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
      courseCategory: "",
      coursePrice: "0",
      courseStatus: false,
    },
  });

  /* ---------- Load course data into form & Redux ---------- */
  useEffect(() => {
    if (course) {
      // Populate form fields
      methods.reset({
        courseTitle: course.title,
        courseDescription: course.description,
        courseCategory: course.category,
        coursePrice: centsToDollars(course.price), // Convert cents to display format
        courseStatus: course.status === "Published",
      });

      // Load sections into Redux store
      dispatch(setSections(course.sections || []));
    }
  }, [course, methods]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- Form Submission Handler ---------- */
  const onSubmit = async (data: CourseFormData) => {
    try {
      // Upload any videos and get updated sections
      const updatedSections = await uploadAllVideos(
        sections,
        id,
        getUploadVideoUrl
      );

      // Prepare form data for API
      const formData = createCourseFormData(data, updatedSections);

      // Update course via API
      await updateCourse({
        courseId: id,
        formData,
      }).unwrap();

      // Refresh course data
      refetch();
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  /* ---------- Render UI ---------- */
  return (
    <div>
      {/* Back Button */}
      <div className="flex items-center gap-5 mb-5">
        <button
          className="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2 cursor-pointer hover:bg-customgreys-dirtyGrey hover:text-white-100 text-customgreys-dirtyGrey"
          onClick={() => router.push("/teacher/courses", { scroll: false })}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>
      </div>

      {/* Main Form */}
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* Header with Publish/Draft toggle & Save button */}
          <Header
            title="Course Setup"
            subtitle="Complete all fields and save your course"
            rightElement={
              <div className="flex items-center space-x-4">
                {/* Status Switch */}
                <CustomFormField
                  name="courseStatus"
                  label={methods.watch("courseStatus") ? "Published" : "Draft"}
                  type="switch"
                  className="flex items-center space-x-2"
                  labelClassName={`text-sm font-medium ${
                    methods.watch("courseStatus")
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                  inputClassName="data-[state=checked]:bg-green-500"
                />

                {/* Save Button */}
                <Button
                  type="submit"
                  className="bg-primary-700 hover:bg-primary-600"
                >
                  {methods.watch("courseStatus")
                    ? "Update Published Course"
                    : "Save Draft"}
                </Button>
              </div>
            }
          />

          {/* Form Layout */}
          <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
            {/* ---------- Left Column: Course Details ---------- */}
            <div className="basis-1/2">
              <div className="space-y-4">
                {/* Course Title */}
                <CustomFormField
                  name="courseTitle"
                  label="Course Title"
                  type="text"
                  placeholder="Write course title here"
                  className="border-none"
                  initialValue={course?.title}
                />

                {/* Course Description */}
                <CustomFormField
                  name="courseDescription"
                  label="Course Description"
                  type="textarea"
                  placeholder="Write course description here"
                  initialValue={course?.description}
                />

                {/* Course Category */}
                <CustomFormField
                  name="courseCategory"
                  label="Course Category"
                  type="select"
                  placeholder="Select category here"
                  options={[
                    { value: "technology", label: "Technology" },
                    { value: "science", label: "Science" },
                    { value: "mathematics", label: "Mathematics" },
                    {
                      value: "Artificial Intelligence",
                      label: "Artificial Intelligence",
                    },
                  ]}
                  initialValue={course?.category}
                />

                {/* Course Price */}
                <CustomFormField
                  name="coursePrice"
                  label="Course Price"
                  type="number"
                  placeholder="0"
                  initialValue={course?.price}
                />
              </div>
            </div>

            {/* ---------- Right Column: Sections & Chapters ---------- */}
            <div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold text-secondary-foreground">
                  Sections
                </h2>

                {/* Add Section Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    dispatch(openSectionModal({ sectionIndex: null }))
                  }
                  className="border-none text-primary-700 group"
                >
                  <Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:white-100" />
                  <span className="text-primary-700 group-hover:white-100">
                    Add Section
                  </span>
                </Button>
              </div>

              {/* Section List / DnD Editor */}
              {isLoading ? (
                <p>Loading course content...</p>
              ) : sections.length > 0 ? (
                <DroppableComponent />
              ) : (
                <p>No sections available</p>
              )}
            </div>
          </div>
        </form>
      </Form>

      {/* Modals for managing sections & chapters */}
      <ChapterModal />
      <SectionModal />
    </div>
  );
};

export default CourseEditor;
