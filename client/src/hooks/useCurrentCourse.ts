import { useGetCourseQuery } from "@/state/api";
import { useSearchParams } from "next/navigation";

/**
 * Fetches the current course data using the "id" query parameter in the URL.
 * Returns { course, courseId, isLoading, error, ... }.
 */

export const useCurrentCourse = () => {
    const searchParams = useSearchParams();
    const courseId = searchParams.get("id") ?? "";
    const {data: course, ...rest} = useGetCourseQuery(courseId);

    return {course, courseId, ...rest};
}