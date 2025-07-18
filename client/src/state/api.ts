//createApi: Helps you define API endpoints.
//fetchBaseQuery: A basic wrapper around fetch() to talk to a REST API.
//they are designed to simplify data fetching and caching
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {BaseQueryApi, FetchArgs} from "@reduxjs/toolkit/query";
import { User } from "@clerk/nextjs/server";

// This is a custom base query function for RTK Query.
// It wraps around fetchBaseQuery and helps extract only the `data` part from the API response.

const customBaseQuery = async (
  args: string | FetchArgs,      // API request info (like URL, params, method)
  api: BaseQueryApi,             // RTK Query's internal tools (like dispatch, getState)
  extraOptions: {}               // Any extra options (not commonly used)
) => {

  // Create a default fetch function using the base URL from your .env config
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, // e.g., "http://localhost:8001"
  });

  try {
    // Make the actual API request using the baseQuery
    const result: any = await baseQuery(args, api, extraOptions);

    // If the response has a `data` field, extract the inner `data` field (e.g., response.data.data)
    // This simplifies your component code — you get only the actual payload.
    if (result.data) {
      result.data = result.data.data;
    }

    // Return the cleaned-up result
    return result;

  } catch (error: unknown) {
    // If an error happens (e.g., network failure), format it in a standard way
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Return the error in a shape that RTK Query can understand
    return {
      error: {
        status: "FETCH_ERROR",
        error: errorMessage,
      },
    };
  }
};


//it just sends the GET request with the URL (and optional query param), gets back an array of courses, and tags it as "Courses".
//
export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["Courses", "Users"], // Define the types of data that can be cached and invalidated
  endpoints: (build) => ({

    updateUser: build.mutation<User, Partial<User> & { userId: string}>({
      query: ({ userId, ...updatedUser }) => ({
        url: `users/clerk/${userId}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),

    getCourses: build.query<Course[], {category?: string}>({
      query: ({ category }) => ({
        url: "courses",
        params: {category},
      }),
      providesTags: ["Courses"],
    }),
    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) =>[{type: "Courses", id}],
    })
  }),
});

export const { useUpdateUserMutation, useGetCoursesQuery, useGetCourseQuery} = api;
