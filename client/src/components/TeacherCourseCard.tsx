import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";

/* =========================
   TeacherCourseCard Component
   Displays a single course in the teacher's dashboard.
   - Shows image, title, category, status, and enrollments
   - If the user is the owner, shows Edit/Delete buttons
   - If not owner, shows "View Only"
   ========================= */
const TeacherCourseCard = ({
  course,
  onEdit,
  onDelete,
  isOwner,
}: TeacherCourseCardProps) => {
  return (
    <Card className="course-card-teacher group">
      {/* ---------- Image Header ---------- */}
      <CardHeader className="course-card-teacher__header">
        <Image
          src={course.image || "/placeholder.png"}
          alt={course.title}
          width={370}
          height={150}
          className="course-card-teacher__image"
          priority
        />
      </CardHeader>

      {/* ---------- Main Content ---------- */}
      <CardContent className="course-card-teacher__content">
        <div className="flex flex-col">
          {/* Course title */}
          <CardTitle className="course-card-teacher__title">
            {course.title}
          </CardTitle>

          {/* Course category */}
          <CardDescription className="course-card-teacher__category">
            {course.category}
          </CardDescription>

          {/* Status (Published / Draft) with colored badge */}
          <p className="text-sm mb-2">
            Status:{" "}
            <span
              className={cn(
                "font-semibold px-2 py-1 rounded",
                course.status === "Published"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              )}
            >
              {course.status}
            </span>
          </p>

          {/* Enrollment count (only if exists) */}
          {course.enrollments && (
            <p className="ml-1 mt-1 inline-block text-secondary bg-secondary/10 text-sm font-normal">
              <span className="font-bold text-white-100">
                {course.enrollments.length}
              </span>{" "}
              Student{course.enrollments.length > 1 ? "s" : ""} Enrolled
            </p>
          )}
        </div>

        {/* ---------- Action Buttons ---------- */}
        <div className="w-full xl:flex space-y-2 xl:space-y-0 gap-2 mt-3">
          {isOwner ? (
            <>
              {/* Edit button */}
              <div>
                <Button
                  className="course-card-teacher__edit-button"
                  onClick={() => onEdit(course)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>

              {/* Delete button */}
              <div>
                <Button
                  className="course-card-teacher__delete-button"
                  onClick={() => onDelete(course)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </>
          ) : (
            // Fallback for non-owners
            <p className="text-sm text-gray-500 italic">View Only</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherCourseCard;
