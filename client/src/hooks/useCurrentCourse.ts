import { useGetCourseQuery } from "@/state/api";
import { useSearchParams } from "next/navigation";

/* ================================
   useCurrentCourse Hook
   -------------------------------
   PURPOSE:
   - Retrieves the current course based on the `id` query parameter in the URL.

   FEATURES:
   1. Reads `courseId` from the URL search parameters.
   2. Fetches course data from the API using `useGetCourseQuery`.
   3. Returns course data along with loading, error, and other query states.

   RETURNS:
   - course: The fetched course object (or undefined if not loaded).
   - courseId: The course ID from the query string.
   - isLoading: Boolean indicating if the request is in progress.
   - error: Error object if the request fails.
   - ...rest: Any additional query properties from RTK Query.

   USAGE:
   const { course, courseId, isLoading, error } = useCurrentCourse();
   ================================ */
export const useCurrentCourse = () => {
  /* ---------- Get courseId from URL ---------- */
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id") ?? "";

  /* ---------- Fetch course data ---------- */
  const { data: course, ...rest } = useGetCourseQuery(courseId);

  /* ---------- Return API ---------- */
  return { course, courseId, ...rest };
};
