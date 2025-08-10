// -------------------- Imports --------------------
// Import utilities for defining API endpoints and making requests
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { User } from "@clerk/nextjs/server";
import { toast } from "sonner";

// -------------------- Custom Base Query --------------------
/**
 * Custom wrapper around RTK Query's `fetchBaseQuery`.
 * - Automatically attaches the user's Clerk token to requests (if available).
 * - Handles global success/error toast messages.
 * - Extracts the `data` field from API responses for easier usage in components.
 */
const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  // Create a base query with API base URL and token injection
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
  });

  try {
    // Make API request
    const result: any = await baseQuery(args, api, extraOptions);

    // Show toast for API errors
    if (result.error) {
      const errorData = result.error.data;
      const errorMessage =
        errorData?.message ||
        result.error.status.toString() ||
        "An error occurred";
      toast.error(`Error: ${errorMessage}`);
    }

    // Show toast for non-GET requests if server sends a success message
    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";
    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) {
        toast.success(successMessage);
      }
    }

    // Extract only the inner `data` field from the API response
    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 204
    ) {
      return { data: null };
    }

    return result;
  } catch (error: unknown) {
    // Handle network or unexpected errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      error: {
        status: "FETCH_ERROR",
        error: errorMessage,
      },
    };
  }
};

// -------------------- API Definition --------------------
/**
 * Defines all backend endpoints for the app using RTK Query.
 * - Tag types ("Courses", "Users") allow cache invalidation when related data changes.
 * - Each endpoint describes how to make a request (URL, method, body) and what it returns.
 */
export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["Courses", "Users"],
  endpoints: (build) => ({
    /* -------- User (Clerk) Endpoints -------- */
    updateUser: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updatedUser }) => ({
        url: `users/clerk/${userId}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),

    /* -------- Course Endpoints -------- */
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "courses",
        params: { category },
      }),
      providesTags: ["Courses"],
    }),
    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),
    updateCourse: build.mutation<
      Course,
      { courseId: string; formData: FormData }
    >({
      query: ({ courseId, formData }) => ({
        url: `courses/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Courses", id: courseId },
      ],
    }),
    createCourse: build.mutation<
      Course,
      { teacherId: string; teacherName: string }
    >({
      query: (body) => ({
        url: `courses`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: build.mutation<{ message: string }, string>({
      query: (courseId) => ({
        url: `courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
    getUploadVideoUrl: build.mutation<
      { uploadUrl: string; videoUrl: string },
      {
        courseId: string;
        chapterId: string;
        sectionId: string;
        fileName: string;
        fileType: string;
      }
    >({
      query: ({
        courseId,
        sectionId,
        chapterId,
        fileName,
        fileType,
      }) => ({
        url: `courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/get-upload-url`,
        method: "POST",
        body: { fileName, fileType },
      }),
    }),

    /* -------- Transaction Endpoints -------- */
    getTransactions: build.query<Transaction[], string>({
      query: (userId) => `transactions?userId=${userId}`,
    }),
    createStripePaymentIntent: build.mutation<
      { clientSecret: string },
      { amount: number }
    >({
      query: ({ amount }) => ({
        url: `/transactions/stripe/payment-intent`,
        method: "POST",
        body: { amount },
      }),
    }),
    createTransaction: build.mutation<Transaction, Partial<Transaction>>({
      query: (transaction) => ({
        url: "transactions",
        method: "POST",
        body: transaction,
      }),
    }),
  }),
});

// -------------------- Hook Exports --------------------
/**
 * These are auto-generated hooks from RTK Query.
 * You can use them directly in components to call the endpoints.
 */
export const {
  useUpdateUserMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useGetUploadVideoUrlMutation,
  useGetCourseQuery,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useCreateStripePaymentIntentMutation,
} = api;
